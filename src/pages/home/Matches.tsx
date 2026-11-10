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
    const isLoggedIn = useAuth((s) => s.isLoggedIn());
    const upcoming_replays = useReplayStore((s) => s.replays);
    const accumulator_replays = useReplayStore((s) => s.accumulator);
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

    const { refetchGames, refetchAccumulators } = useFetchGames();
    const refetch = () => {
        refetchGames();
        refetchAccumulators();
    };

    return (
        <>
            {/*
              Mobile: stacks under the rooms, list has a capped height.
              Desktop: the column is exactly as tall as the game row; the
              list takes the leftover space and scrolls, bet widget stays put.
            */}
            <div className="flex w-full min-w-0 flex-col gap-3 text-white/70 lg:h-full lg:min-h-0 lg:w-[35%] lg:max-w-[520px] lg:shrink-0">
                {/* {live_replay && (
                    <LiveMatch id={live_replay.id} teams={live_replay.teams} />
                )} */}

                {isLoggedIn ? (
                    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
                        {upcoming_replays && upcoming_replays.length > 0 ? (
                            <div className="flex min-h-0 flex-col lg:flex-1">
                                <div className="flex shrink-0 items-center gap-2">
                                    <h1
                                        onClick={() => setMatchType("SINGLE")}
                                        className={`flex-1 cursor-pointer p-1 text-center text-xs font-bold sm:text-sm xl:text-base ${matchType === "SINGLE" ? "bg-[#FFB800]/40 text-[#2E071B] rounded-tr-lg rounded-tl-lg border border-[#ffa400]" : "text-white"}`}
                                    >
                                        Single Match Parley
                                    </h1>
                                    <h1
                                        onClick={() => setMatchType("MULTI")}
                                        className={`flex-1 cursor-pointer p-1 text-center text-xs font-bold sm:text-sm xl:text-base ${matchType === "MULTI" ? "bg-[#FFB800]/40 text-[#2E071B] rounded-tr-lg rounded-tl-lg border border-[#ffa400]" : "text-white"}`}
                                    >
                                        Multi Match Parleys
                                    </h1>
                                </div>
                                {matchType === "SINGLE" && (
                                    <div className="custom-scrollbar relative flex max-h-[50vh] flex-col gap-3 overflow-y-auto rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ffa400] p-2 shadow-lg shadow-black lg:max-h-none lg:min-h-0 lg:flex-1">
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
                                                    refetch={refetch}
                                                />
                                            ))}
                                    </div>
                                )}

                                {matchType === "MULTI" && (
                                    <div className="custom-scrollbar relative flex max-h-[50vh] flex-col gap-3 overflow-y-auto rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ffa400] p-2 shadow-lg shadow-black lg:max-h-none lg:min-h-0 lg:flex-1">
                                        {accumulator_replays.map((m) => (
                                            <UpcomingAccumulator
                                                key={m.id}
                                                id={m.id}
                                                legs={m.legs}
                                                status={m.status}
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
                            <div className="shadow-lg shadow-black text-center text-white text-lg font-bold w-full">
                                No Games Available !!!
                                <p className="text-xs font-normal text-white/60 mt-1">
                                    Looking for new games ...
                                </p>
                            </div>
                        )}
                        <BetWidget
                            choosenBet={choosenBet}
                            choosenAccumulatorBet={choosenAccumulatorBet}
                            matchType={matchType}
                            betAmount={betAmount}
                            setBetAmount={setBetAmout}
                        />
                    </div>
                ) : (
                    <div className="relative flex flex-col gap-3 lg:h-full lg:min-h-0 lg:overflow-hidden">
                        <NotLoggedIn />
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
                                refetch={refetch}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* <Accumulator bet_amount={betAmount} /> */}
        </>
    );
}

