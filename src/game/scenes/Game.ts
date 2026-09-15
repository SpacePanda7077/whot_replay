import { Scene, Math as PhaserMath } from "phaser";
import { EventBus } from "../EventBus";
import { Card } from "../components/Card";
import { GameOrganizer } from "../components/game_org/game.organizer";
import { replay } from "../repaly.data";

export class Game extends Scene {
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
        this.add
            .image(width / 2, height / 2, "background")
            .setDisplaySize(width, height);
        this.create_card_base_shape();
        new GameOrganizer(this, replay);

        EventBus.emit("current-scene-ready", this);
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
}
