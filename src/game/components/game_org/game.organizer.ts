import { Scene } from "phaser";

import { Card } from "../Card";
import { Player } from "../Player";
import { Card_Info, suit_shapes } from "../../repaly.data";
import { Players } from "../../../store/replay.store";

export type placement = {
    x: number;
    y: number;
    rot: number;
    play_rot: number;
};

export class GameOrganizer {
    initial_deck: Card[] = [];
    scene: Scene;
    placements: placement[];
    market_offset = 0;
    players: Player[] = [];
    turn_circle: Phaser.GameObjects.Arc;

    // When true, Card.move_to / Card.reveal skip tweens and jump straight to
    // their final state. Game1 turns this on while fast-forwarding catch-up
    // frames after a refresh.
    instant = false;

    constructor(scene: Scene) {
        this.scene = scene;
        const width = scene.scale.width;
        const height = scene.scale.height;

        this.placements = [
            { x: width / 2 + 100, y: height - 100, rot: 0, play_rot: 60 }, // 0: bottom
            { x: width / 2 - 100, y: 100, rot: 0, play_rot: 40 }, // 1: top
        ];

        this.turn_circle = this.scene.add
            .circle(-1000, -1000, 65, 0xff0000, 0.5)
            .setStrokeStyle(5, 0xff0000);
        scene.tweens.add({
            targets: this.turn_circle,
            scale: 1.1,
            yoyo: true,
            repeat: -1,
            duration: 1000,
        });
    }

    initialze_game(
        initial_deck: Card_Info[],
        players: Players,
        initail_hands: Card_Info[][],
    ) {
        // Make initialisation idempotent.
        this.players = [];
        this.initial_deck = [];
        this.market_offset = 0;

        players.forEach((decks, playerIndex) => {
            const placemant = this.placements[playerIndex];
            const player = new Player(
                this.scene,
                this,
                playerIndex,
                initail_hands[decks.player_index],
                placemant,
                decks.full_name,
            );
            this.players[playerIndex] = player;
        });

        this.arrange_market(initial_deck);
    }

    arrange_market(market_decks: Card_Info[]) {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        for (const deck of market_decks) {
            const c = new Card(
                this.scene,
                suit_shapes[deck.suit],
                deck.number,
                width / 2 - 300,
                height / 2,
                0,
                -1,
                0,
                null,
                this,
            );
            this.initial_deck.push(c);
            this.market_offset += 1;
        }
    }

    addCardCounterAndAvatar(x: number, y: number) {
        const container = this.scene.add.container(x, y);
        const border = this.scene.add.circle(0, 50, 55, 0x703857);
        const avatar = this.scene.add
            .sprite(0, 50, "avatar_1")
            .setDisplaySize(100, 100);
        const text_border = this.scene.add.circle(50, -30, 30, 0x361527);
        const text_bg = this.scene.add.circle(50, -30, 25, 0x12070d);
        const card_left_text = this.scene.add
            .text(50, -30, "6", {
                fontSize: "24px",
                fontStyle: "bold",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        container
            .add([border, avatar, text_border, text_bg, card_left_text])
            .setDepth(1000000);
    }
}
