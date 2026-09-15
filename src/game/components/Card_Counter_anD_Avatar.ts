import { Scene } from "phaser";

export class CardCounterAndAvatar {
    scene: Scene;
    card_left_text: Phaser.GameObjects.Text;
    constructor(scene: Scene, x: number, y: number, card_left: number) {
        this.scene = scene;
        this.addCardCounterAndAvatar(x, y, card_left);
    }
    addCardCounterAndAvatar(x: number, y: number, card_left: number) {
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

        container
            .add([border, avatar, text_border, text_bg, this.card_left_text])
            .setDepth(1000000);
    }
    update_cards_left(cards_left: number) {
        this.card_left_text.text = cards_left.toString();
    }
}

