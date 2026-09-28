import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import Header from "../../components/header/Header";
import Matches from "./Matches";
import { useReplayStore } from "../../store/replay.store";
import { useQuery } from "@tanstack/react-query";
import { streamGame } from "../../api/games-api";

import { motion } from "motion/react";
import { EventBus } from "../../game/EventBus";
import { Scene } from "phaser";
import { useSceneStore } from "../../store/scene-store";
import OpenBets from "../../components/openBet-component";

export default function Home() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const liveReplay = useReplayStore((s) => s.live_replay);
    const watchIndex = useReplayStore((s) => s.watchIndex);
    const setWatchIndex = useReplayStore((s) => s.setWatchIndex);
    const scene = useSceneStore((s) => s.scene);
    const setScene = useSceneStore((s) => s.setScene);

    const currentGame = liveReplay?.[watchIndex];

    const { data: ReplayStream, error: ReplayStreamError } = useQuery({
        queryKey: ["get_replay_stream", currentGame?.id],
        queryFn: () => streamGame(currentGame!.id),
        enabled: !!currentGame,
    });

    useEffect(() => {
        if (ReplayStream) {
            console.log(ReplayStream);
        }
        if (ReplayStreamError) {
            console.log(ReplayStreamError);
        }
    }, [ReplayStream, ReplayStreamError]);

    const handleSetwatchIndex = (index: number) => {
        if (!scene) return;
        if (index === watchIndex) return;
        setWatchIndex(index);
        const gameIndex = index + 1;
        scene.scene.start(`Game${gameIndex}`);
        console.log("Set Index to : ", index);
    };

    useEffect(() => {
        const handle_scene = (scene: Scene) => {
            setScene(scene);
            console.log("Current scene : ", scene.scene.key);
        };
        EventBus.on("current-scene-ready", handle_scene);
    }, []);

    return (
        <>
            <Header />
            <div className="flex flex-col items-center pb-70 justify-center mt-30 ">
                <div className=" w-[95vw] h-full lg:h-[85vh] flex flex-col lg:flex-row gap-4">
                    <div className="w-full h-full">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <motion.button
                                    whileTap={{ y: 10 }}
                                    animate={{ y: watchIndex === 0 ? 10 : 0 }}
                                    style={{ opacity: liveReplay[0] ? 1 : 0.4 }}
                                    disabled={liveReplay[0] === undefined}
                                    onClick={() => handleSetwatchIndex(0)}
                                    className="bg-[#FFB800] rounded-tr-lg rounded-tl-lg font-bold p-1 flex items-center text-center "
                                >
                                    Game #1
                                </motion.button>
                                <motion.button
                                    style={{ opacity: liveReplay[1] ? 1 : 0.4 }}
                                    animate={{ y: watchIndex === 1 ? 10 : 0 }}
                                    disabled={liveReplay[1] === undefined}
                                    onClick={() => handleSetwatchIndex(1)}
                                    className="bg-[#FFB800] rounded-tr-lg rounded-tl-lg font-bold p-1 flex items-center text-center "
                                >
                                    Game #2
                                </motion.button>
                                <motion.button
                                    style={{ opacity: liveReplay[2] ? 1 : 0.4 }}
                                    animate={{ y: watchIndex === 2 ? 10 : 0 }}
                                    disabled={liveReplay[2] === undefined}
                                    onClick={() => handleSetwatchIndex(2)}
                                    className="bg-[#FFB800] rounded-tr-lg rounded-tl-lg font-bold p-1 flex items-center text-center "
                                >
                                    Game #3
                                </motion.button>
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

