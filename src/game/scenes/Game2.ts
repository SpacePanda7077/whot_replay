import { Scene, Scenes } from "phaser";
import { EventBus } from "../EventBus";

import { GameOrganizer } from "../components/game_org/game.organizer";
import { Players } from "../../store/replay.store";
import { Card_Info, suit_shapes } from "../repaly.data";

type Frame = {
    type: string;
    payload: {
        card: Card_Info;
        cards: Card_Info[];
        player_index: number;
        suit: number;
    };
    seq: number;
};

// If more than this many frames are waiting when we drain, we treat it as a
// catch-up (e.g. after a page refresh) and apply them instantly, no tweens.
const FAST_FORWARD_THRESHOLD = 3;
// Frames arriving within this window are batched together.
const BATCH_WINDOW_MS = 50;

export class Game2 extends Scene {
    blind_cover: Phaser.GameObjects.Rectangle;
    organizer: GameOrganizer;
    loading_text: Phaser.GameObjects.Text;

    // frame handling state
    frame_queue: Frame[] = [];
    ready = false;
    last_seq = -1;
    drain_scheduled = false;

    constructor() {
        super("Game2");
    }

    preload() {
        this.load.setPath("assets");
    }

    create() {
        // Scene instances are reused by Phaser, so reset all per-run state.
        this.frame_queue = [];
        this.ready = false;
        this.last_seq = -1;
        this.drain_scheduled = false;

        const width = this.scale.width;
        const height = this.scale.height;
        this.cameras.main.setZoom(0.8);

        if (!this.sound.isPlaying("bg")) {
            this.sound.play("bg", { loop: true, volume: 0.6 });
        }

        this.blind_cover = this.add
            .rectangle(width * 0.5, height * 0.5, 100000, 100000, 0x2c071a)
            .setDepth(100000000);
        this.loading_text = this.add
            .text(width * 0.5, height * 0.5, "Please wait Loading Game ...", {
                fontStyle: "bold",
                fontSize: "32px",
                color: "white",
                stroke: "black",
                strokeThickness: 15,
            })
            .setDepth(100000010)
            .setOrigin(0.5);
        this.tweens.add({
            targets: this.loading_text,
            alpha: 0.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

        this.add
            .image(width / 2, height / 2, "background")
            .setDisplaySize(width, height)
            .setScale(1.2);
        this.create_card_base_shape();
        this.organizer = new GameOrganizer(this);

        EventBus.emit("current-scene-ready", this);
        this.handle_events();

        // Remove EventBus listeners when the scene shuts down or is destroyed
        // so a stale listener can't fire against destroyed GameObjects.
        this.events.once(Scenes.Events.SHUTDOWN, this.cleanup_events, this);
        this.events.once(Scenes.Events.DESTROY, this.cleanup_events, this);
    }

    create_card_base_shape() {
        const g = this.add.graphics();

        // Card background
        g.fillStyle(0xffffff);
        g.fillRoundedRect(0, 0, 100, 160, 6);

        // Border
        g.lineStyle(3, 0x000000, 0.4);
        g.strokeRoundedRect(0, 0, 100, 160, 6);

        // Save as a texture
        g.generateTexture("card-base", 100, 160);
        g.destroy();
    }

    handle_events() {
        EventBus.once("game_start", this.handle_game_start);
        EventBus.on("frame", this.handle_frame_event);
    }

    cleanup_events() {
        EventBus.off("game_start", this.handle_game_start);
        EventBus.off("frame", this.handle_frame_event);
    }

    handle_game_start = (data: {
        initial_deck: { suit: number; number: number }[];
        initial_hands: { suit: number; number: number }[][];
        initial_last_card: { suit: number; number: number };
        players: Players;
    }) => {
        this.blind_cover.setVisible(false);
        this.loading_text.setVisible(false);
        this.organizer.initialze_game(
            data.initial_deck,
            data.players,
            data.initial_hands,
        );

        this.ready = true;
        // Anything that arrived before game_start is waiting in the queue.
        this.schedule_drain();
    };

    // Frames are never applied directly. They go into a queue, and the queue
    // is drained after a short batch window so bursts can be detected.
    handle_frame_event = (data: Frame) => {
        this.frame_queue.push(data);
        if (this.ready) this.schedule_drain();
    };

    schedule_drain() {
        if (this.drain_scheduled) return;
        this.drain_scheduled = true;
        this.time.delayedCall(BATCH_WINDOW_MS, () => {
            this.drain_scheduled = false;
            this.drain_frames();
        });
    }

    drain_frames() {
        if (!this.ready) return;

        const fast_forward = this.frame_queue.length > FAST_FORWARD_THRESHOLD;
        const batch = this.frame_queue;
        this.frame_queue = [];

        // Instant mode makes Card.move_to / Card.reveal skip their tweens.
        this.organizer.instant = fast_forward;
        try {
            for (const frame of batch) {
                this.apply_frame(frame, !fast_forward);
            }
        } finally {
            this.organizer.instant = false;
        }
    }

    apply_frame(data: Frame, animate: boolean) {
        // Ignore duplicates / replays of frames we already applied.
        if (data.seq <= this.last_seq) return;
        this.last_seq = data.seq;

        switch (data.type) {
            case "NEXT_TURN": {
                const pos =
                    this.organizer.placements[data.payload.player_index];
                this.organizer.turn_circle.setPosition(pos.x, pos.y + 50);
                break;
            }
            case "PLAY_CARD": {
                const index = data.payload.player_index;
                const card_info = data.payload.card;
                const player = this.organizer.players[index];
                if (!player) {
                    console.warn("PLAY_CARD for unknown player", index);
                    break;
                }
                for (const p of this.organizer.players) {
                    p.avatar.deSelect_Suit();
                }
                const playing_card = player.cards.shift();
                if (playing_card) {
                    playing_card.reveal(
                        data.seq,
                        playing_card.pos_id,
                        suit_shapes[card_info.suit],
                        card_info.number,
                    );
                    if (animate) {
                        this.sound.play("card_play");
                        const sound = this.getSound(card_info.number);
                        if (sound) this.sound.play(sound);
                    }
                } else {
                    console.log("Cant Find Card In MY Deck");
                }
                break;
            }
            case "PICK_CARD": {
                const p_index = data.payload.player_index;
                const decks = this.organizer.initial_deck;
                for (let i = 0; i < data.payload.cards.length; i++) {
                    const playing_card = decks.shift();
                    if (playing_card) {
                        playing_card.take_market(data.seq, p_index);
                    } else {
                        console.log("Cant Find Card In Market");
                    }
                }
                break;
            }
            case "SELECT_SUIT": {
                const p_player =
                    this.organizer.players[data.payload.player_index];
                if (!p_player) break;
                p_player.avatar.select_suits(data.payload.suit);
                if (animate) this.sound.play("i_need");
                break;
            }
        }
    }

    getSound(number: number) {
        if (number === 1) return "hold_on";
        if (number === 2) return "pick_2";
        if (number === 8) return "suspension";
        if (number === 14) return "go_gen";
    }
}
