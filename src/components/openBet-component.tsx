import {
    bet_key,
    calculateBetStats,
    is_accumulator,
    useHistoryStore,
} from "../store/history";
import { useMemo, useState } from "react";
import { get_odds, useAllOdds } from "../hooks/useOdds";

import OpenBet from "./openbet";

export default function OpenBets() {
    const betHistory = useHistoryStore((s) => s.bets);
    const odds = useAllOdds();
    const [show, setShow] = useState(false);

    const openBets = useMemo(
        () => betHistory.filter((b) => b.status === "placed"),
        [betHistory],
    );

    const amountStaked = useMemo(
        () => calculateBetStats(openBets).totalStaked,
        [openBets],
    );

    // Total return if every open bet wins: sum of amount * current odds.
    // Bets with no odds yet are skipped and flagged so we can show "~".
    const { potential, missing } = useMemo(() => {
        let potential = 0;
        let missing = 0;
        for (const b of openBets) {
            const acc = is_accumulator(b);
            const id = acc ? b.accumulator_id : b.game_id;
            const key = acc ? b.combo : b.team;
            const o = id && key ? get_odds(odds, id)?.[key] : undefined;
            if (typeof o === "number") potential += b.amount * o;
            else missing += 1;
        }
        return { potential: Math.round(potential), missing };
    }, [openBets, odds]);

    return (
        <>
            <div className="fixed top-[100%] p-2 rounded-tr-lg text-white/60 rounded-tl-lg bg-[#530237] border border-[#ffb800] w-full -translate-y-full">
                <div
                    onClick={() => setShow((prev) => !prev)}
                    className="flex w-full items-center justify-between "
                >
                    <div className="flex flex-col ">
                        <div className="text-xs">STAKES</div>
                        <div className="text-white font-bold">
                            ₦{amountStaked}
                        </div>
                    </div>
                    <div className="flex flex-col items-end ">
                        <div className="text-xs">POTENTIAL EARNINGS</div>
                        <div className="text-[#ffb800] font-bold">
                            {openBets.length === 0
                                ? "₦0"
                                : `${missing > 0 ? "~" : ""}₦${potential}`}
                        </div>
                    </div>
                </div>
                {show && (
                    <div className=" bg-[#4A0131] p-2 rounded-lg flex flex-col gap-2 max-h-[170px] overflow-y-auto">
                        {openBets.length > 0 ? (
                            <>
                                {openBets.map((b) => (
                                    <OpenBet key={bet_key(b)} bet={b} />
                                ))}
                            </>
                        ) : (
                            <p className="text-center text-white">
                                No Open Bets Available
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
