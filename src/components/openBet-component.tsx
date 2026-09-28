import { bet, calculateBetStats, useHistoryStore } from "../store/history";
import { useEffect, useState } from "react";

import OpenBet from "./openbet";

export default function OpenBets() {
    const betHistory = useHistoryStore((s) => s.bets);
    const [openBets, setOpenBets] = useState<bet[]>([]);
    const [amountStaked, setAmountStaked] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const openbets = betHistory.filter((bet) => bet.status === "placed");
        const { totalStaked, netProfitLoss } = calculateBetStats(openbets);
        setAmountStaked(totalStaked);
        console.log(totalStaked, netProfitLoss);
        setOpenBets(openbets);
    }, [betHistory]);

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
                        <div className="text-[#ffb800] font-bold">₦7000</div>
                    </div>
                </div>
                {show && (
                    <div className=" bg-[#4A0131] p-2 rounded-lg flex flex-col gap-2 max-h-[170px] overflow-y-auto">
                        {openBets.length > 0 ? (
                            <>
                                {openBets.map((b) => (
                                    <OpenBet key={b.id} bet={b} />
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

