import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import Header from "../../components/header/Header";
import Matches from "./Matches";
import { useReplayStore } from "../../store/replay.store";
import { streamGame } from "../../api/games-api";
import { useLiveSlots } from "../../hooks/useLiveSlots";

import { motion } from "motion/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { EventBus } from "../../game/EventBus";
import { Scene } from "phaser";
import { useSceneStore } from "../../store/scene-store";
import OpenBets from "../../components/openBet-component";
import UpcomingMatch from "./UpcomingMatch";
import LiveChoices from "./LiveChoices";
import LiveMatchTopInfo from "./LiveMatchTopInfo";

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

    // Mobile room carousel: one room visible at a time, arrows to move.
    const roomsRef = useRef<HTMLDivElement | null>(null);
    const [roomPos, setRoomPos] = useState(0);

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

    const rooms = GAME_SLOTS.filter((i) => liveReplay?.[i] !== undefined);

    const goToRoom = (pos: number) => {
        const el = roomsRef.current;
        const target = el?.children[pos] as HTMLElement | undefined;
        if (!el || !target) return;
        el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    };

    const handleRoomsScroll = () => {
        const el = roomsRef.current;
        if (!el || el.clientWidth === 0) return;
        const pos = Math.round(el.scrollLeft / el.clientWidth);
        setRoomPos(Math.max(0, Math.min(pos, rooms.length - 1)));
    };

    const handleSetwatchIndex = (index: number) => {
        if (!scene || switching) return; // ignore clicks mid-switch
        if (index === watchIndex) return;
        setWatchIndex(index);
        scene.scene.start(`Game${index + 1}`);
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center gap-15 pb-70 justify-center mt-30  ">
                <div className=" w-[95vw] h-full lg:h-[85vh] flex flex-col lg:flex-row gap-4">
                    <div className="w-full h-full">
                        <div className="flex justify-between items-center">
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
                    {/* Mobile: one room at a time, arrows scroll the others in */}
                    <div className="lg:hidden w-[95vw] max-w-[95vw] shadow-lg shadow-black relative border border-[#ffa400] px-4 pb-4 pt-6 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        {rooms.length > 0 ? (
                            <>
                                <div
                                    ref={roomsRef}
                                    onScroll={handleRoomsScroll}
                                    className="relative flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                >
                                    {rooms.map((i) => (
                                        <div
                                            key={i}
                                            className="w-full shrink-0 snap-center px-1 pt-3"
                                        >
                                            <motion.div
                                                onClick={() =>
                                                    handleSetwatchIndex(i)
                                                }
                                                className="w-full shadow-lg text-white shadow-black bg-black/35 relative flex flex-col gap-3 border border-[#ffa400] p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                                            >
                                                <div>
                                                    <LiveMatchTopInfo
                                                        id={liveReplay[i]?.id}
                                                        status={
                                                            liveReplay[i]
                                                                ?.status
                                                        }
                                                    />
                                                    <LiveChoices
                                                        id={liveReplay[i]?.id}
                                                        teams={
                                                            liveReplay[i]
                                                                ?.players
                                                        }
                                                        status={
                                                            liveReplay[i]
                                                                ?.status
                                                        }
                                                    />
                                                </div>
                                                {watchIndex === i && (
                                                    <div className="bg-[#f01e07] p-2 rounded-lg text-[8px] absolute top-[-15%] right-0 font-bold text-white">
                                                        Watching
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>

                                {rooms.length > 1 && (
                                    <>
                                        <button
                                            aria-label="Previous room"
                                            disabled={roomPos === 0}
                                            onClick={() =>
                                                goToRoom(roomPos - 1)
                                            }
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#ffa400] text-[#310420] shadow-md shadow-black disabled:opacity-30"
                                        >
                                            <IoIosArrowBack size={18} />
                                        </button>
                                        <button
                                            aria-label="Next room"
                                            disabled={
                                                roomPos === rooms.length - 1
                                            }
                                            onClick={() =>
                                                goToRoom(roomPos + 1)
                                            }
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#ffa400] text-[#310420] shadow-md shadow-black disabled:opacity-30"
                                        >
                                            <IoIosArrowForward size={18} />
                                        </button>

                                        <div className="flex justify-center gap-1.5 mt-2">
                                            {rooms.map((i, pos) => (
                                                <button
                                                    key={i}
                                                    aria-label={`Room ${pos + 1}`}
                                                    onClick={() =>
                                                        goToRoom(pos)
                                                    }
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        pos === roomPos
                                                            ? "w-4 bg-[#ffa400]"
                                                            : "w-1.5 bg-white/30"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center text-white font-bold text-xs">
                                <p>Match not available</p>
                            </div>
                        )}
                    </div>

                    <Matches />
                </div>
                <div className="hidden w-[95vw] gap-2 shadow-lg shadow-black relative lg:flex gap-3 border border-[#ffa400] p-4 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                    {liveReplay.length > 0 ? (
                        <>
                            {GAME_SLOTS.map((i) => {
                                const available = liveReplay[i] !== undefined;
                                if (!available) return null;
                                return (
                                    <motion.div
                                        key={i}
                                        onClick={() => handleSetwatchIndex(i)}
                                        className="w-full shadow-lg text-white shadow-black bg-black/35 relative flex flex-col gap-3 border border-[#ffa400] p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                                    >
                                        <div>
                                            <LiveMatchTopInfo
                                                id={liveReplay[i]?.id}
                                                status={liveReplay[i]?.status}
                                            />
                                            <LiveChoices
                                                id={liveReplay[i]?.id}
                                                teams={liveReplay[i]?.players}
                                                status={liveReplay[i]?.status}
                                            />
                                        </div>
                                        {watchIndex === i && (
                                            <div className="bg-[#f01e07] p-2 rounded-lg text-[8px] absolute top-[-15%] right-0 font-bold text-white">
                                                Watching
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-center text-white font-bold text-xs">
                                <p>Match not available</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <OpenBets />
        </>
    );
}
