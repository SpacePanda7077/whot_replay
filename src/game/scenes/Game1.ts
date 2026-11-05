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
// Let the last card animation play before the winner screen takes over.
const WINNER_DELAY_MS = 800;
const WINNER_DEPTH = 100000100;
// Player colours: index 0 = orange side, index 1 = blue side.
const WINNER_COLORS = [0xf97316, 0x3b82f6];
const CONFETTI_COLORS = [0xffa400, 0xf01e07, 0x3b82f6, 0x22c55e, 0xffffff];

export class Game1 extends Scene {
    blind_cover: Phaser.GameObjects.Rectangle;
    organizer: GameOrganizer;
    loading_text: Phaser.GameObjects.Text;

    // frame handling state
    frame_queue: Frame[] = [];
    ready = false;
    last_seq = -1;
    drain_scheduled = false;

    // winner screen state
    player_info: Players | null = null;
    winner_objects: Phaser.GameObjects.GameObject[] = [];
    winner_timer?: Phaser.Time.TimerEvent;
    winner_active = false;

    constructor() {
        super("Game1");
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
        this.player_info = null;
        this.winner_objects = [];
        this.winner_timer = undefined;
        this.winner_active = false;

        const width = this.scale.width;
        const height = this.scale.height;
        this.cameras.main.setZoom(0.8);

        if (!this.sound.isPlaying("bg")) {
            // this.sound.play("bg", { loop: true, volume: 0.6 });
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
        EventBus.on("game_end", this.handle_game_end);
    }

    cleanup_events() {
        EventBus.off("game_start", this.handle_game_start);
        EventBus.off("frame", this.handle_frame_event);
        EventBus.off("game_end", this.handle_game_end);
    }

    handle_game_start = (data: {
        initial_deck: { suit: number; number: number }[];
        initial_hands: { suit: number; number: number }[][];
        initial_last_card: { suit: number; number: number };
        players: Players;
    }) => {
        this.hide_winner_screen();
        this.player_info = data.players;
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

    handle_game_end = (data: { winner_player_index: number }) => {
        console.log(data);
        if (this.winner_active) return; // already showing / scheduled
        this.winner_active = true;
        this.winner_timer = this.time.delayedCall(WINNER_DELAY_MS, () => {
            this.blind_cover.setVisible(true);
            this.show_winner_screen(data.winner_player_index);
        });
    };

    hide_winner_screen() {
        this.winner_timer?.remove(false);
        this.winner_timer = undefined;
        this.winner_active = false;
        for (const obj of this.winner_objects) {
            this.tweens.killTweensOf(obj);
            obj.destroy();
        }
        this.winner_objects = [];
    }

    show_winner_screen(winner_index: number) {
        this.hide_winner_screen();
        this.winner_active = true; // block a repeated game_end stacking a 2nd screen

        const cx = this.scale.width * 0.5;
        const cy = this.scale.height * 0.5;
        const color = WINNER_COLORS[winner_index] ?? 0xffa400;
        const name =
            this.player_info?.[winner_index]?.full_name ??
            `Player ${winner_index + 1}`;
        const track = <T extends Phaser.GameObjects.GameObject>(o: T) => {
            this.winner_objects.push(o);
            return o;
        };

        // Dim backdrop
        const dim = track(
            this.add
                .rectangle(cx, cy, 100000, 100000, 0x000000, 0.6)
                .setDepth(WINNER_DEPTH)
                .setAlpha(0),
        );
        this.tweens.add({ targets: dim, alpha: 1, duration: 400 });

        // Rotating light rays behind the banner
        const rays = track(this.add.graphics().setDepth(WINNER_DEPTH + 1));
        const RAY_COUNT = 14;
        const RAY_LEN = Math.max(this.scale.width, this.scale.height);
        rays.fillStyle(color, 0.25);
        for (let i = 0; i < RAY_COUNT; i++) {
            const a0 = (i / RAY_COUNT) * Math.PI * 2;
            const a1 = a0 + (Math.PI * 2) / RAY_COUNT / 2;
            rays.beginPath();
            rays.moveTo(0, 0);
            rays.lineTo(Math.cos(a0) * RAY_LEN, Math.sin(a0) * RAY_LEN);
            rays.lineTo(Math.cos(a1) * RAY_LEN, Math.sin(a1) * RAY_LEN);
            rays.closePath();
            rays.fillPath();
        }
        rays.setPosition(cx, cy).setAlpha(0).setScale(0.2);
        this.tweens.add({
            targets: rays,
            alpha: 1,
            scale: 1,
            duration: 600,
            ease: "Cubic.easeOut",
        });
        this.tweens.add({
            targets: rays,
            angle: 360,
            duration: 14000,
            repeat: -1,
        });

        // Glow disc
        const glow = track(
            this.add
                .circle(cx, cy, 190, color, 0.35)
                .setDepth(WINNER_DEPTH + 2)
                .setScale(0),
        );
        this.tweens.add({
            targets: glow,
            scale: 1,
            duration: 500,
            ease: "Back.easeOut",
        });
        this.tweens.add({
            targets: glow,
            scale: 1.15,
            alpha: 0.2,
            duration: 900,
            yoyo: true,
            repeat: -1,
            delay: 500,
            ease: "Sine.easeInOut",
        });

        // Trophy-ish star
        const star = track(
            this.add
                .star(cx, cy - 130, 5, 28, 60, 0xffd700)
                .setStrokeStyle(6, 0x8a5a00)
                .setDepth(WINNER_DEPTH + 3)
                .setScale(0),
        );
        this.tweens.add({
            targets: star,
            scale: 1,
            angle: 360,
            duration: 700,
            delay: 150,
            ease: "Back.easeOut",
        });
        this.tweens.add({
            targets: star,
            scale: 1.12,
            duration: 700,
            yoyo: true,
            repeat: -1,
            delay: 900,
            ease: "Sine.easeInOut",
        });

        // "WINNER" banner
        const title = track(
            this.add
                .text(cx, cy - 20, "WINNER!", {
                    fontStyle: "bold",
                    fontSize: "96px",
                    color: "#ffd700",
                    stroke: "#2c071a",
                    strokeThickness: 18,
                })
                .setOrigin(0.5)
                .setDepth(WINNER_DEPTH + 4)
                .setScale(0),
        );
        this.tweens.add({
            targets: title,
            scale: 1,
            duration: 600,
            delay: 250,
            ease: "Back.easeOut",
        });

        // Winner name
        const label = track(
            this.add
                .text(cx, cy + 80, name, {
                    fontStyle: "bold",
                    fontSize: "48px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 10,
                })
                .setOrigin(0.5)
                .setDepth(WINNER_DEPTH + 4)
                .setAlpha(0),
        );
        this.tweens.add({
            targets: label,
            alpha: 1,
            y: cy + 90,
            duration: 500,
            delay: 600,
        });

        // Confetti: manual tweens so it doesn't depend on the Phaser version
        // (the camera is zoomed out, so spread wider than the canvas).
        const spread = this.scale.width / 0.8;
        const top = cy - this.scale.height / 0.8 / 2 - 40;
        const fall = this.scale.height / 0.8 + 120;
        for (let i = 0; i < 70; i++) {
            const piece = track(
                this.add
                    .rectangle(
                        cx - spread / 2 + Math.random() * spread,
                        top - Math.random() * 300,
                        8 + Math.random() * 8,
                        12 + Math.random() * 10,
                        CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    )
                    .setDepth(WINNER_DEPTH + 5)
                    .setAngle(Math.random() * 360),
            );
            this.tweens.add({
                targets: piece,
                y: piece.y + fall,
                x: piece.x + (Math.random() - 0.5) * 160,
                angle: piece.angle + (Math.random() > 0.5 ? 720 : -720),
                duration: 2500 + Math.random() * 2000,
                delay: Math.random() * 1800,
                repeat: -1,
                onRepeat: () => {
                    piece.y = top - Math.random() * 200;
                },
            });
        }

        if (this.cache.audio.exists("winner")) this.sound.play("winner");
    }

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
