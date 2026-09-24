import { Scene, Math as PhaserMath } from "phaser";
import { EventBus } from "../EventBus";

import { GameOrganizer } from "../components/game_org/game.organizer";
import { Players } from "../../store/replay.store";
import { Card_Info, suit_shapes } from "../repaly.data";

export class Game extends Scene {
    blind_cover: Phaser.GameObjects.Rectangle;
    organizer: GameOrganizer;
    loading_text: Phaser.GameObjects.Text;
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("avatar_1", "phaser/avatars/avatar_1.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "phaser/logo.png");
        this.load_shapes();
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

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
            .setDisplaySize(width, height);
        this.create_card_base_shape();
        this.organizer = new GameOrganizer(this);

        EventBus.emit("current-scene-ready", this);
        this.handle_events();
    }

    create_card_base_shape() {
        const g = this.add.graphics();

        // Card background
        g.fillStyle(0xffffff);
        g.fillRoundedRect(0, 0, 100, 160, 12);

        // Border
        g.lineStyle(3, 0x000000);
        g.strokeRoundedRect(0, 0, 100, 160, 12);

        // Save as a texture
        g.generateTexture("card-base", 100, 160);
        g.destroy();
    }
    load_shapes() {
        const shapes = [
            "circle",
            "cross",
            "square",
            "star",
            "triangle",
            "whot",
        ];
        for (const shape of shapes) {
            this.load.image(shape, `phaser/shapes/${shape}.png`);
        }
    }
    handle_events() {
        EventBus.once(
            "game_start",
            (data: {
                initial_deck: { suit: number; number: number }[];
                initial_hands: { suit: number; number: number }[][];
                initial_last_card: { suit: number; number: number };
                players: Players;
            }) => {
                this.blind_cover.setVisible(false);
                this.loading_text.setVisible(false);
                console.log("Game start");
                this.organizer.initialze_game(
                    data.initial_deck,
                    data.players,
                    data.initial_hands,
                );

                console.log(this.organizer.players[0].cards);
                console.log(this.organizer.players[1].cards);
            },
        );

        EventBus.on(
            "frame",
            (data: {
                type: string;
                payload: {
                    card: Card_Info;
                    cards: Card_Info[];
                    player_index: number;
                };
                seq: number;
            }) => {
                switch (data.type) {
                    case "NEXT_TURN":
                        const pos =
                            this.organizer.placements[
                                data.payload.player_index
                            ];
                        this.organizer.turn_circle.setPosition(
                            pos.x,
                            pos.y + 50,
                        );
                        console.log(data.payload.player_index);
                        break;
                    case "PLAY_CARD":
                        console.log(data.payload.player_index);
                        const index = data.payload.player_index;
                        const card_info = data.payload.card;
                        const player = this.organizer.players[index];
                        const cards = player.cards;
                        const playing_card = cards.shift();
                        if (playing_card) {
                            playing_card.reveal(
                                data.seq,
                                playing_card.pos_id,
                                suit_shapes[card_info.suit],
                                card_info.number,
                            );
                        } else {
                            console.log("Cant Find Card In MY Deck");
                        }
                        break;
                    case "PICK_CARD":
                        const P_index = data.payload.player_index;
                        const p_player = this.organizer.players[P_index];
                        const decks = this.organizer.initial_deck;
                        for (const p_card of data.payload.cards) {
                            const playing_card = decks.shift();
                            if (playing_card) {
                                playing_card.take_market(data.seq, P_index);
                            } else {
                                console.log("Cant Find Card In Market");
                            }
                        }

                        break;
                    case "SELECT_SUIT":
                        break;
                }
            },
        );
    }
}
