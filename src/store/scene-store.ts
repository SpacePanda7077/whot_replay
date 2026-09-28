import { Scene } from "phaser";
import { create } from "zustand";

type scene_type = {
    scene: Scene | null;
    setScene: (scene: Scene) => void;
};

export const useSceneStore = create<scene_type>((set) => ({
    scene: null,
    setScene: (scene) => set({ scene }),
}));

