import {
    bet_key,
    calculateBetStats,
    is_accumulator,
    useHistoryStore,
} from "../store/history";
import { useEffect, useMemo, useState } from "react";
import { get_odds, useAllOdds } from "../hooks/useOdds";

import OpenBet from "./openbet";
import { useQuery } from "@tanstack/react-query";
import { Get_Slip_Bets } from "../api/bet-api";

export default function OpenBets() {
    const betHistory = useHistoryStore((s) => s.bets);
    const odds = useAllOdds();
    const [show, setShow] = useState(false);
    const [code, setCode] = useState<string>("");
    const [serach, setSearch] = useState(false);

    const { data: betslip, error: betSlipError } = useQuery({
        queryKey: ["get_bets_from_slip"],
        queryFn: () => Get_Slip_Bets(code!),
        enabled: serach,
    });

    const openBets = useMemo(
        () => betHistory.filter((b) => b.status === "placed"),
        [betHistory],
    );

    const amountStaked = useMemo(
        () => calculateBetStats(openBets).totalStaked,
        [openBets],
    );

    useEffect(() => {
        if (betslip) {
            console.log(betslip);
            setSearch(false);
        }
        if (betSlipError) {
            console.log(betSlipError);
            setSearch(false);
        }
    }, [betslip, betSlipError]);

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
            <div className="fixed inset-x-0 bottom-0 z-40 rounded-tl-lg rounded-tr-lg border border-[#ffb800] bg-[#530237] p-2 text-white/60">
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
                    <div className="flex flex-col gap-5 ">
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
                        <div className="flex items-center gap-4">
                            <input
                                className="border border-[#ffb800]/50 w-full p-2 rounded-lg placeholder-white/70"
                                type="text"
                                placeholder="Input Slip Code ..."
                                name=""
                                id=""
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button
                                onClick={() => setSearch(true)}
                                className="p-2 bg-[#ffb800] rounded-lg text-[#530237] font-bold"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

