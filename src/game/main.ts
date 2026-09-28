import { Game1 } from "./scenes/Game1";
import { AUTO, Game, Scale, Types } from "phaser";
import { Game2 } from "./scenes/Game2";
import { Game3 } from "./scenes/Game3";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,

    parent: "game-container",
    scale: {
        mode: Scale.FIT, // or RESIZE, ENVELOP, etc.
        autoCenter: Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
    backgroundColor: "#361527",
    scene: [Game1, Game2, Game3],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
