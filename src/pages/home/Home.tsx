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
import { useBetResults } from "../../hooks/useBetResults";
import BetResultModal from "../../components/bet-result-modal";

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

    // The store outlives this page, but the Phaser game is rebuilt every
    // time Home mounts and Boot always starts Game1. Reset the selection
    // so watchIndex matches the scene that is actually running; otherwise
    // the page waits for e.g. Game2 forever, clicks are ignored and
    // nothing streams.
    useEffect(() => {
        setWatchIndex(0);
        return () => setWatchIndex(0);
    }, [setWatchIndex]);

    // Win / loss / refund popup once a watched game you bet on ends.
    const { results: bet_results, dismiss: dismiss_results } = useBetResults();

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
            {/*
              Page flow: header is fixed (~80px), so pt-24 clears it. The page
              scrolls normally; on desktop the game + bet column row gets a
              viewport-based height and each column scrolls internally, so
              nothing can spill over the rooms panel below it.
            */}
            <main className="mx-auto flex w-[95vw] max-w-[1600px] flex-col gap-4 pt-24 pb-32 lg:pt-28">
                <div className="flex flex-col gap-4 lg:h-[calc(100dvh-11rem)] lg:min-h-[520px] lg:flex-row">
                    <section className="flex min-w-0 flex-col gap-1 lg:h-full lg:flex-1">
                        {/* Top row: game switcher on the left, game info on the right */}
                        <div className="mb-1 flex shrink-0 items-center justify-between gap-3">
                            {/* The game being played stays pressed down */}
                            <div className="flex shrink-0 items-start gap-2">
                                {GAME_SLOTS.map((i) => {
                                    const available =
                                        liveReplay?.[i] !== undefined;
                                    const pressed = watchIndex === i;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            aria-pressed={pressed}
                                            disabled={
                                                !available ||
                                                (switching && !pressed)
                                            }
                                            onClick={() =>
                                                handleSetwatchIndex(i)
                                            }
                                            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold transition-all duration-100 disabled:opacity-40 sm:px-4 sm:text-sm ${
                                                pressed
                                                    ? "translate-y-1 border-b-0 bg-gradient-to-b from-[#4BD97A] to-[#2DA84E] text-white shadow-inner shadow-black/60"
                                                    : "border-b-4 border-b-[#B88A27] bg-gradient-to-b from-[#ffb800] to-[#F9B92D] text-[#3B0526] active:translate-y-1 active:border-b-0"
                                            }`}
                                        >
                                            Game #{i + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            {liveReplay[watchIndex] && (
                                <div className="flex min-w-0 flex-col items-end gap-0.5 text-[10px] text-white sm:flex-row sm:items-center sm:gap-4 sm:text-xs">
                                    <p className="max-w-full truncate">
                                        game id : {liveReplay[watchIndex].id}
                                    </p>
                                    <p className="whitespace-nowrap">
                                        date played: {"10/04/2026"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/*
                          Phaser uses Scale.FIT, which needs a parent with a real
                          size. Mobile: a 4:3 box (same ratio as the 1024x768
                          game). Desktop: fill the column. The canvas lives in an
                          absolutely positioned layer so its size is always definite.
                        */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tr-lg rounded-br-lg rounded-bl-lg border-2 border-[#ffa500]/90 bg-[url('/assets/bg.png')] bg-cover shadow-lg shadow-black lg:aspect-auto lg:min-h-0 lg:flex-1">
                            <div className="absolute inset-0 backdrop-blur-lg">
                                <PhaserGame ref={phaserRef} />
                            </div>
                        </div>
                    </section>
                    {/* Mobile: one room at a time, arrows scroll the others in */}
                    <div className="relative w-full shrink-0 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ffa400] px-8 pb-4 pt-6 shadow-lg shadow-black lg:hidden">
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
                                            className="w-full shrink-0 snap-center px-1 pt-4"
                                        >
                                            <motion.div
                                                onClick={() =>
                                                    handleSetwatchIndex(i)
                                                }
                                                className="relative flex w-full min-w-0 flex-col gap-3 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ffa400] bg-black/35 p-2 text-white shadow-lg shadow-black"
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
                                                    <div className="absolute -top-3 right-0 rounded-lg bg-[#f01e07] px-2 py-1 text-[10px] font-bold text-white">
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
                                            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#ffa400] text-[#310420] shadow-md shadow-black disabled:opacity-30"
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
                                            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#ffa400] text-[#310420] shadow-md shadow-black disabled:opacity-30"
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
                <div className="relative hidden w-full gap-3 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ffa400] p-4 pt-6 shadow-lg shadow-black lg:flex">
                    {liveReplay.length > 0 ? (
                        <>
                            {GAME_SLOTS.map((i) => {
                                const available = liveReplay[i] !== undefined;
                                if (!available) return null;
                                return (
                                    <motion.div
                                        key={i}
                                        onClick={() => handleSetwatchIndex(i)}
                                        className="relative flex min-w-0 flex-1 cursor-pointer flex-col gap-3 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ffa400] bg-black/35 p-2 text-white shadow-lg shadow-black"
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
                                            <div className="absolute -top-3 right-0 rounded-lg bg-[#f01e07] px-2 py-1 text-[10px] font-bold text-white">
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
            </main>
            <OpenBets />
            {bet_results.length > 0 && (
                <BetResultModal
                    results={bet_results}
                    onClose={dismiss_results}
                />
            )}
        </>
    );
}
