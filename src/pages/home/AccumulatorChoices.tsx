import { OddsLeg } from "../../api/odds.client";
import { Players } from "../../store/replay.store";

import { Side } from "./Accumulator.utils";
import SplitBar from "./SplitBar";

interface Prop {
    id: string; // accumulator id (stored in choosenBet.game_id)
    index: number; // leg position, also the position in the combo
    leg_count: number;
    teams: Players;
    // false once the accumulator is locked (a leg has started)
    disabled?: boolean;
    // split of this accumulator's tickets on this leg (from the odds stream)
    leg_split?: OddsLeg;
    choosenBet: {
        game_id: string;
        combo: string[];
    };
    setChoosenBet: React.Dispatch<
        React.SetStateAction<{
            game_id: string;
            combo: string[];
        }>
    >;
}

export default function AccumulatorChoices({
    id,
    index,
    leg_count,
    teams,
    disabled = false,
    leg_split,
    choosenBet,
    setChoosenBet,
}: Prop) {
    const handleBet = (side: Side) => {
        if (disabled) return;

        setChoosenBet((prev) => {
            // Picks from a different accumulator must not leak into this one.
            const base = prev.game_id === id ? prev.combo : [];
            // Copy (never mutate state) and keep one slot per leg, so picking
            // leg 2 before leg 1 doesn't leave holes in the array.
            const combo = Array.from(
                { length: leg_count },
                (_, i) => base[i] ?? "",
            );
            combo[index] = side;
            return { game_id: id, combo };
        });
    };

    const sides = [
        { key: "orange", dot: "bg-orange-500", team: teams[0] },
        { key: "blue", dot: "bg-blue-500", team: teams[1] },
    ] as const;

    // Hide the split until somebody has staked on this leg.
    const has_split = !!leg_split && leg_split.orange + leg_split.blue > 0;
    const orange_pct = Math.round(leg_split?.orange_percent ?? 0);

    return (
        <div className="mt-2">
            <p className="text-[10px] text-white/50 mb-1">
                Match {index + 1}
            </p>
            <div className="flex gap-4 items-center ">
                {sides.map((side, i) => (
                    <div key={side.key} className="contents">
                        {i === 1 && <h2 className="text-white/30">VS</h2>}
                        <button
                            disabled={disabled}
                            onClick={() => handleBet(side.key)}
                            style={{ opacity: disabled ? 0.3 : 1 }}
                            className={` w-full flex justify-between items-center
                                 p-1 border border-white/20 rounded-lg cursor-pointer
                                 ${
                                     choosenBet.game_id === id &&
                                     choosenBet.combo[index] === side.key
                                         ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]"
                                         : "bg-[#4a0a32] text-white"
                                 }
                                 `}
                        >
                            <div className="flex items-center justify-between w-full ">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${side.dot}`}
                                    ></div>
                                    <h1>{`${side.team.full_name.split(" ")[0]} `}</h1>
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {has_split && leg_split && (
                <SplitBar
                    orange_percent={orange_pct}
                    passed={leg_split.passed}
                />
            )}
        </div>
    );
}
