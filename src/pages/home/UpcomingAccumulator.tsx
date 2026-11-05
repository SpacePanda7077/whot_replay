import { Players } from "../../store/replay.store";
import UpcomingAccumulatorTopInfo from "./UpcomingAccumulatorTopInfo";
import AccumulatorChoices from "./AccumulatorChoices";
import { useAccumulatorLegs, useGameOdds } from "../../hooks/useOdds";
import {
    ACCUMULATOR_LEGS,
    picked_count,
    to_combo_string,
} from "./Accumulator.utils";

interface Prop {
    id: string;
    legs: { game_id: string; players: Players }[];
    status: string;
    // choosenBet.game_id holds the accumulator id; combo holds "orange" |
    // "blue" per leg. Use to_combo_string(combo, legs.length) ("OBO") when
    // calling POST /api/accumulators/bets.
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

export default function UpcomingAccumulator({
    id,
    legs,
    choosenBet,
    status,
    setChoosenBet,
}: Prop) {
    // Live data from the odds stream: odds keyed by combo ("OB", ...), and the
    // split of this accumulator's tickets on each leg.
    const odds = useGameOdds(id);
    const split = useAccumulatorLegs(id);

    // Only an accumulator with exactly 3 matches can be bet on.
    const valid_legs = legs.length === ACCUMULATOR_LEGS;
    const is_open = status === "open" && valid_legs;
    const selected = choosenBet.game_id === id;
    const picks = selected ? choosenBet.combo : [];
    const picked = picked_count(picks);
    const combo = to_combo_string(picks, legs.length);
    const combo_odds = combo ? odds?.[combo] : undefined;

    // If any leg is outside the allowed split when betting closes, the whole
    // accumulator is voided and refunded.
    const at_risk = !!split?.some((l) => !l.passed);

    // Same card shell as UpcomingMatch, legs always visible (no Show toggle).
    return (
        <div className="p-4 border border-[#ffa500]/20 rounded-lg shadow-md shadow-black">
            <UpcomingAccumulatorTopInfo
                id={id}
                status={status}
                picked={picked}
                total={ACCUMULATOR_LEGS}
                at_risk={at_risk}
            />

            {legs.map((l, i) => (
                <AccumulatorChoices
                    key={l.game_id}
                    id={id}
                    index={i}
                    leg_count={legs.length}
                    teams={l.players}
                    disabled={!is_open}
                    leg_split={
                        split?.find((s) => s.game_id === l.game_id) ?? split?.[i]
                    }
                    choosenBet={choosenBet}
                    setChoosenBet={setChoosenBet}
                />
            ))}

            {!valid_legs ? (
                <p className="mt-3 text-xs text-red-300">
                    Accumulators need exactly {ACCUMULATOR_LEGS} matches.
                </p>
            ) : (
                selected && (
                    <p className="mt-3 text-xs text-white/80">
                        {combo
                            ? `Your pick: ${combo} · ${
                                  typeof combo_odds === "number"
                                      ? `${combo_odds.toFixed(2)}x`
                                      : "–"
                              }`
                            : `Pick all ${ACCUMULATOR_LEGS} matches to bet (${picked}/${ACCUMULATOR_LEGS})`}
                    </p>
                )
            )}

            <p className="mt-2 text-[10px] text-white/40">
                You must pick all {ACCUMULATOR_LEGS} matches. If any leg's split
                is too lopsided when betting closes, the accumulator is voided
                and all stakes are refunded.
            </p>
        </div>
    );
}
