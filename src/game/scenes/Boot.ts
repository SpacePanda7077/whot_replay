import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("avatar_1", "phaser/avatars/avatar_1.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "phaser/logo.png");
        this.load_shapes();
        this.loadVoices();
        this.load.audio("bg", "phaser/sounds/bg.mp3");
        this.load.audio("card_play", "phaser/sounds/card_play.mp3");
    }

    create() {
        EventBus.emit("current-scene-ready", this);
        this.scene.start("Game1");
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

    loadVoices() {
        const voices = ["go_gen", "hold_on", "i_need", "pick_2", "suspension"];
        for (const voice of voices) {
            this.load.audio(voice, `phaser/sounds/voice/${voice}.mp3`);
        }
    }
}

