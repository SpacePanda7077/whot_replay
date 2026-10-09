import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import Header from "../../components/header/Header";
import Matches from "./Matches";
import { useReplayStore } from "../../store/replay.store";
import { streamGame } from "../../api/games-api";
import { useLiveSlots } from "../../hooks/useLiveSlots";

import { motion } from "motion/react";
import { EventBus } from "../../game/EventBus";
import { Scene } from "phaser";
import { useSceneStore } from "../../store/scene-store";
import OpenBets from "../../components/openBet-component";

const GAME_SLOTS = [0, 1, 2];

// What the current scene run is showing.
type SceneRun = {
    key: string; // "Game1" | "Game2" | "Game3"
    game_id?: string; // game this run is bound to (undefined = not claimed yet)
    n: number; // bumps on every scene (re)start
};

export default function Home() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const liveReplay = useReplayStore((s) => s.live_replay);
    const watchIndex = useReplayStore((s) => s.watchIndex);
    const setWatchIndex = useReplayStore((s) => s.setWatchIndex);
    const scene = useSceneStore((s) => s.scene);
    const setScene = useSceneStore((s) => s.setScene);
    const [run, setRun] = useState<SceneRun | null>(null);

    // Keeps the 3 slots filled and swaps ended games for other locked ones.
    useLiveSlots();

    const currentGame = liveReplay?.[watchIndex];
    const game_id = currentGame?.id;

    // The scene run is usable for the selected game when it is the right
    // scene and is either unclaimed or already bound to this exact game.
    const expected_key = `Game${watchIndex + 1}`;
    const active =
        !!run &&
        run.key === expected_key &&
        (run.game_id === undefined || run.game_id === game_id);
    const switching = !active;

    // Every time a scene (re)starts, remember which game it was started for.
    useEffect(() => {
        const handle_scene = (s: Scene) => {
            setScene(s);
            const { live_replay, watchIndex } = useReplayStore.getState();
            setRun((prev) => ({
                key: s.scene.key,
                game_id: live_replay[watchIndex]?.id,
                n: (prev?.n ?? 0) + 1,
            }));
            console.log("Current scene : ", s.scene.key);
        };
        EventBus.on("current-scene-ready", handle_scene);
        return () => {
            EventBus.off("current-scene-ready", handle_scene);
        };
    }, [setScene]);

    // One replay stream, owned by this effect. It only opens once the scene
    // for the selected game is ready, and its cleanup closes it before the
    // next one opens (tab switch, game replaced, scene restarted).
    useEffect(() => {
        if (!game_id || !active) return;
        // Claim this scene run for the game so a later change of game_id
        // is recognised as "needs a fresh scene".
        setRun((r) => (r && r.game_id === undefined ? { ...r, game_id } : r));
        return streamGame(game_id);
    }, [game_id, active, run?.n]);

    // The watched slot got a different game (the old one ended and was
    // replaced): restart the same scene so it starts from a clean board.
    // Tab switches change watchIndex and are handled by handleSetwatchIndex.
    const prev = useRef({ index: watchIndex, id: game_id });
    useEffect(() => {
        const p = prev.current;
        if (p.index === watchIndex && p.id && game_id && p.id !== game_id) {
            scene?.scene.restart();
        }
        prev.current = { index: watchIndex, id: game_id };
    }, [watchIndex, game_id, scene]);

    const handleSetwatchIndex = (index: number) => {
        if (!scene || switching) return; // ignore clicks mid-switch
        if (index === watchIndex) return;
        setWatchIndex(index);
        scene.scene.start(`Game${index + 1}`);
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center pb-70 justify-center mt-30 ">
                <div className=" w-[95vw] h-full lg:h-[85vh] flex flex-col lg:flex-row gap-4">
                    <div className="w-full h-full">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                {GAME_SLOTS.map((i) => {
                                    const available =
                                        liveReplay[i] !== undefined;
                                    return (
                                        <motion.button
                                            key={i}
                                            whileTap={{ y: 10 }}
                                            animate={{
                                                y: watchIndex === i ? 10 : 0,
                                            }}
                                            style={{
                                                opacity: available
                                                    ? switching
                                                        ? 0.7
                                                        : 1
                                                    : 0.4,
                                            }}
                                            disabled={!available || switching}
                                            onClick={() =>
                                                handleSetwatchIndex(i)
                                            }
                                            className="bg-[#FFB800] rounded-tr-lg rounded-tl-lg font-bold p-1 flex items-center text-center "
                                        >
                                            Game #{i + 1}
                                        </motion.button>
                                    );
                                })}
                            </div>
                            {liveReplay[watchIndex] && (
                                <div className="flex items-center gap-4 text-white text-xs">
                                    <p>game id : {liveReplay[watchIndex].id}</p>
                                    <p>date played: {"10/04/2026"}</p>
                                </div>
                            )}
                        </div>

                        <div className=" bg-[url('/assets/bg.png')] bg-cover relative w-full h-full flex items-center justify-center rounded-tr-lg rounded-br-lg rounded-bl-lg border-2 border-[#ffa500]/90  overflow-hidden shadow-lg shadow-black">
                            <div className=" w-full h-full flex items-center justify-center backdrop-blur-lg">
                                <PhaserGame ref={phaserRef} />
                            </div>
                        </div>
                    </div>

                    <Matches />
                </div>
            </div>
            <OpenBets />
        </>
    );
}

