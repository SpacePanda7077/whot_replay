import { Scene } from "phaser";
import { suit_shapes } from "../repaly.data";

export class CardCounterAndAvatar {
    scene: Scene;
    card_left_text: Phaser.GameObjects.Text;
    needed_shape: Phaser.GameObjects.Sprite;
    needed_shape_bg: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        card_left: number,
        name: string,
    ) {
        this.scene = scene;
        this.addCardCounterAndAvatar(x, y, card_left, name);
    }

    addCardCounterAndAvatar(
        x: number,
        y: number,
        card_left: number,
        player_name: string,
    ) {
        const container = this.scene.add.container(x, y);
        const border = this.scene.add.circle(0, 50, 55, 0x703857);
        const avatar = this.scene.add
            .sprite(0, 50, "avatar_1")
            .setDisplaySize(100, 100);
        const text_border = this.scene.add.circle(50, -30, 30, 0x361527);
        const text_bg = this.scene.add.circle(50, -30, 25, 0x12070d);
        this.card_left_text = this.scene.add
            .text(50, -30, card_left.toString(), {
                fontSize: "24px", // Adjust size as needed
                fontStyle: "bold", // Makes the text bold
                fontFamily: "Arial", // Optional: specify font family
            })
            .setOrigin(0.5);
        const name = this.scene.add
            .text(0, 140, player_name, {
                fontSize: "24px",
                fontStyle: "bold",
                stroke: "black",
                strokeThickness: 10,
            })
            .setOrigin(0.5);
        this.needed_shape_bg = this.scene.add
            .rectangle(-150, 0, 200, 200, 0xffffff)
            .setStrokeStyle(3, 0x000000)
            .setVisible(false);
        this.needed_shape = this.scene.add
            .sprite(-150, 0, "circle")
            .setVisible(false)
            .setTint(0x681f3d);

        container
            .add([
                border,
                avatar,
                text_border,
                text_bg,
                this.card_left_text,
                name,
                this.needed_shape_bg,
                this.needed_shape,
            ])
            .setDepth(1000000);
    }

    update_cards_left(cards_left: number) {
        // Defensive guard: if this instance's scene was torn down (e.g. the
        // user navigated away and the EventBus event arrived late, or a
        // stale listener from a previous scene instance fired), the Text
        // GameObject and its texture are already destroyed. Bail out
        // instead of crashing on a null glTexture.
        if (!this.card_left_text || !this.card_left_text.active) {
            return;
        }
        this.card_left_text.text = cards_left.toString();
    }

    select_suits(suit: number) {
        const shape = suit_shapes[suit];
        this.needed_shape.setTexture(shape);
        this.needed_shape_bg.setVisible(true);
        this.needed_shape.setVisible(true);
    }
    deSelect_Suit() {
        this.needed_shape_bg.setVisible(false);
        this.needed_shape.setVisible(false);
    }
}

