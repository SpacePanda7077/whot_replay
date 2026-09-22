import { ImStack } from "react-icons/im";
import { IoIosArrowDown } from "react-icons/io";
import { useAccumulatedOddStore } from "../../store/history";
import { useEffect, useState } from "react";
import { EventBus } from "../../game/EventBus";
interface Prop {
    bet_amount: number;
}
export default function Accumulator_Public({ bet_amount }: Prop) {
    const total_bets = useAccumulatedOddStore((s) => s.total_bets);

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ffa400]/20 border border-[#ffa400]/50 rounded-lg">
                        <ImStack size={24} color="#ffa400" />
                    </div>
                    <div className="text-sm ">
                        <h2 className="text-white font-bold">
                            {total_bets} Leg Accumulator Slip
                        </h2>
                        <p className="text-xs">
                            Pari-Mutual pool {total_bets} Match Selected
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col gap-1 items-end">
                        <div className=" text-white/80 flex items-center gap-2">
                            <p className="text-xs">
                                {total_bets === 0
                                    ? "None"
                                    : total_bets === 1
                                      ? "Single"
                                      : "Accumulated"}
                            </p>
                            <p className="text-xs">{total_bets}x</p>
                        </div>

                        <h2 className="flex items-center gap-2">
                            <div className=" text-white/80  text-xs flex flex-col items-end justify-end ">
                                <p>
                                    {" "}
                                    stake amount :{" "}
                                    <span className="font-bold">
                                        {" "}
                                        ₦{bet_amount}
                                    </span>
                                </p>
                                <p>
                                    potential earnings :{" "}
                                    <span className="text-[#ffa400] font-bold ">
                                        ₦{total_bets}
                                    </span>
                                </p>
                            </div>
                        </h2>
                    </div>
                    <IoIosArrowDown fontStyle={"bold"} />
                </div>
            </div>
        </>
    );
}

