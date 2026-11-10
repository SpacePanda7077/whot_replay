import { Players } from "../../store/replay.store";
import { useGameOdds } from "../../hooks/useOdds";
import SplitBar from "./SplitBar";

interface Prop {
    id: string;
    teams: Players;
    status: string;
    choosenBet: {
        game_id: string;
        team: string;
    };
    setChoosenBet: React.Dispatch<
        React.SetStateAction<{
            game_id: string;
            team: string;
        }>
    >;
}

const format_odds = (value?: number) =>
    typeof value === "number" ? `${value.toFixed(2)}x` : "–";

// Share of the pool on the orange side. Pari-mutuel odds are ~ pool / side
// stake, so 1/odds is proportional to each side's stake (the fee cancels out).
// Returns undefined until both odds are known.
const orange_share = (orange?: number, blue?: number) => {
    if (!orange || !blue) return undefined;
    const o = 1 / orange;
    const b = 1 / blue;
    return (o / (o + b)) * 100;
};

// If one side holds more than this share of the pool when betting closes the
// match is voided and refunded. SET THIS TO YOUR SERVER'S REAL LIMIT.
const LOPSIDED_LIMIT = 80;

export default function Choices({
    id,
    teams,
    status,
    choosenBet,
    setChoosenBet,
}: Prop) {
    const odds = useGameOdds(id);

    const handleBet = (game_id: string, team: string) => {
        setChoosenBet({ game_id, team });
    };

    const orange_percent =
        status === "open"
            ? orange_share(odds?.orange, odds?.blue)
            : undefined;
    const lopsided =
        orange_percent !== undefined &&
        (orange_percent > LOPSIDED_LIMIT || orange_percent < 100 - LOPSIDED_LIMIT);

    const sides = [
        { key: "orange", dot: "bg-orange-500", team: teams[0] },
        { key: "blue", dot: "bg-blue-500", team: teams[1] },
    ] as const;

    return (
        <div className="mt-2">
            <div className="flex items-center gap-2 sm:gap-4">
                {sides.map((side, i) => (
                    <div key={side.key} className="contents">
                        {i === 1 && <h2 className="shrink-0 text-white/30">VS</h2>}
                        <button
                            disabled={status === "scheduled"}
                            onClick={() => handleBet(id, side.key)}
                            style={{
                                opacity: status === "scheduled" ? 0.3 : 1,
                            }}
                            className={` w-full min-w-0 flex justify-between items-center
                                 p-1 border border-white/20 rounded-lg cursor-pointer
                                 ${
                                     choosenBet.game_id === id &&
                                     choosenBet.team === side.key
                                         ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]"
                                         : "bg-[#4a0a32] text-white"
                                 }
                                 `}
                        >
                            <div className="flex w-full min-w-0 items-center justify-between gap-1">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div
                                        className={`h-2 w-2 shrink-0 rounded-full ${side.dot}`}
                                    ></div>
                                    <h1 className="truncate">{`${side.team.full_name.split(" ")[0]} `}</h1>
                                </div>
                                {status === "open" && (
                                    <p className="shrink-0 text-xs">
                                        {format_odds(odds?.[side.key])}
                                    </p>
                                )}
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {orange_percent !== undefined && (
                <SplitBar orange_percent={orange_percent} passed={!lopsided} />
            )}

            <p className="mt-2 text-[10px] text-white/40">
                If this match's split is too lopsided when betting closes, the
                match is voided and all stakes are refunded.
            </p>
        </div>
    );
}
