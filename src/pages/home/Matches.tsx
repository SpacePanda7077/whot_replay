import LiveMatch from "./LiveMatch";
import UpcomingMatch from "./UpcomingMatch";
import Accumulator from "./Accumulator";
import {
    dummy_replay,
    duumy_accumulator,
    useReplayStore,
} from "../../store/replay.store";
import NotLoggedIn from "../../components/info/not-logged-in";
import { useAuth } from "../../store/auth-store";
import BetWidget from "../../components/betWidget";
import { SetStateAction, useState } from "react";
import { useFetchGames } from "../../hooks/useFetchgames";
import UpcomingAccumulator from "./UpcomingAccumulator";

export default function Matches() {
    //const live_replay = useReplayStore((s) => s.);
    const [matchType, setMatchType] = useState<"SINGLE" | "MULTI">("SINGLE");
    const logs = useAuth((s) => s.login_result);
    const upcoming_replays = useReplayStore((s) => s.replays);
    const [betAmount, setBetAmout] = useState(200);
    const [choosenBet, setChoosenBet] = useState({
        game_id: "",
        team: "",
    });
    const [choosenAccumulatorBet, setChoosenAccumulatorBet] = useState<{
        game_id: string;
        combo: string[];
    }>({
        game_id: "",
        combo: [],
    });

    const { refetchGames } = useFetchGames();

    return (
        <>
            <div className="w-full lg:w-[35%] flex flex-col gap-3 text-white/70">
                {/* {live_replay && (
                    <LiveMatch id={live_replay.id} teams={live_replay.teams} />
                )} */}

                {logs ? (
                    <div className="flex flex-col gap-4">
                        {upcoming_replays && upcoming_replays.length > 0 ? (
                            <div>
                                <div className="flex gap-2 items-center">
                                    <h1
                                        onClick={() => setMatchType("SINGLE")}
                                        className={`font-bold cursor-pointer ${matchType === "SINGLE" ? "bg-[#FFB800]/40 text-[#2E071B] rounded-tr-lg rounded-tl-lg border border-[#ffa400]" : "text-white"} p-1`}
                                    >
                                        Single Match Parley
                                    </h1>
                                    <h1
                                        onClick={() => setMatchType("MULTI")}
                                        className={`font-bold cursor-pointer ${matchType === "MULTI" ? "bg-[#FFB800]/40 text-[#2E071B] rounded-tr-lg rounded-tl-lg border border-[#ffa400]" : "text-white"} p-1`}
                                    >
                                        Multi Match Parleys
                                    </h1>
                                </div>
                                {matchType === "SINGLE" && (
                                    <div className=" relative flex flex-col gap-3 max-h-[30vh] md:max-h-[55vh] overflow-y-auto border border-[#ffa400] p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg custom-scrollbar">
                                        {upcoming_replays
                                            .filter(
                                                (r) => r.status !== "locked",
                                            )
                                            .map((m) => (
                                                <UpcomingMatch
                                                    key={m.id}
                                                    id={m.id}
                                                    teams={m.players}
                                                    status={m.status}
                                                    time={{
                                                        open_at: m.bets_open_at,
                                                        close_at:
                                                            m.bets_lock_at,
                                                    }}
                                                    choosenBet={choosenBet}
                                                    setChoosenBet={
                                                        setChoosenBet
                                                    }
                                                    refetch={refetchGames}
                                                />
                                            ))}
                                    </div>
                                )}

                                {matchType === "MULTI" && (
                                    <div className=" relative flex flex-col gap-3 max-h-[30vh] md:max-h-[55vh] md:min-h-[55vh] overflow-y-auto border border-[#ffa400] p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg custom-scrollbar">
                                        {duumy_accumulator.map((m) => (
                                            <UpcomingAccumulator
                                                key={m.id}
                                                id={m.id}
                                                legs={m.legs}
                                                choosenBet={
                                                    choosenAccumulatorBet
                                                }
                                                setChoosenBet={
                                                    setChoosenAccumulatorBet
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className=" text-center text-white text-lg font-bold w-full">
                                No Games Available !!!
                            </div>
                        )}
                        <BetWidget
                            choosenBet={choosenBet}
                            betAmount={betAmount}
                            setBetAmount={setBetAmout}
                        />
                    </div>
                ) : (
                    <div className=" relative mb-20 flex flex-col gap-3">
                        {!logs && <NotLoggedIn />}
                        {dummy_replay.map((m) => (
                            <UpcomingMatch
                                key={m.id}
                                id={m.id}
                                teams={m.players}
                                status={m.status}
                                time={{
                                    open_at: m.bets_open_at,
                                    close_at: m.bets_lock_at,
                                }}
                                choosenBet={choosenBet}
                                setChoosenBet={setChoosenBet}
                                refetch={refetchGames}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* <Accumulator bet_amount={betAmount} /> */}
        </>
    );
}

