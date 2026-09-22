import Accumulated_Match_Info from "./Accumulated_Match_Info";
import { useEffect, useState } from "react";
import { useAccumulatedOddStore } from "../../store/history";
import { useReplayStore } from "../../store/replay.store";
import { EventBus } from "../../game/EventBus";

export default function Accumulator_Private() {
    const suggested_bet_amount = [200, 500, 1000, 5000];
    const [amount, setAmount] = useState<number>(200);
    const handle_select = (value: number) => [setAmount(value)];
    const accumulated_odds = useAccumulatedOddStore((s) => s.accumulated_odds);
    const replays = useReplayStore((s) => s.replays);
    const total_odd = useAccumulatedOddStore((s) => s.total_odds);

    useEffect(() => {
        EventBus.emit("amount_changed", amount);
    }, [amount]);

    return (
        <>
            <div className="flex flex-col gap-2 mt-3">
                <div className="flex flex-col gap-2 max-h-[100px] overflow-auto">
                    {accumulated_odds.length > 0 ? (
                        <div>
                            {accumulated_odds.map((odd, i) => (
                                <Accumulated_Match_Info
                                    key={odd.id}
                                    id={odd.id}
                                    team={odd.team}
                                    odd={0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-white text-xs">
                            No selections yet — tap an odds box above.
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-4">
                        {suggested_bet_amount.map((s_amount) => (
                            <div
                                onClick={() => handle_select(s_amount)}
                                className={`text-white/70 flex justify-center 
                                    py-1 items-center w-full  rounded-lg border cursor-pointer
                                    ${amount === s_amount ? "bg-[#FFA400]/20 border-[#FFA400]/60" : "bg-white/10 border-white/20"}
                                    `}
                            >
                                ₦{s_amount}
                            </div>
                        ))}
                    </div>
                    <div className="w-full">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="Custom Amount ..."
                            className="w-full border border-white/20 text-white rounded-lg outline-none focus-within:border-[#FFA400] p-2"
                        />
                        <button className="bg-[#ffa400] hover:bg-[#ffa400]/80 text-[#310420] shadow-[0_0_10px_2px_#ffa400] w-full rounded-lg outline-none focus-within:border-[#FFA400] p-2 mt-2 font-bold text-xl">
                            Stake
                        </button>
                    </div>
                    <div className="w-full flex justify-between items-center p-2 text-sm bg-[#1a0310]">
                        <div>
                            <p>Stake</p>
                            <h2 className="text-md text-white font-semibold">
                                ₦{amount}
                            </h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <p>EST.Payout</p>
                            <h2 className="text-lg font-bold text-[#FFA400]">
                                ₦{amount * total_odd}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

