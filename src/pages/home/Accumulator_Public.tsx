import { ImStack } from "react-icons/im";
import { IoIosArrowDown } from "react-icons/io";
import { useAccumulatedOddStore } from "../../store/accumulator.store";
import { useEffect, useState } from "react";
import { EventBus } from "../../game/EventBus";
interface Prop {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Accumulator_Public({ setIsOpen }: Prop) {
    const total_odds = useAccumulatedOddStore((s) => s.total_odds);
    const [amount, setAmount] = useState<number>(200);
    const accumulated_odds = useAccumulatedOddStore((s) => s.accumulated_odds);
    useEffect(() => {
        EventBus.on("amount_changed", (data: number) => {
            setAmount(data);
        });

        return () => {
            EventBus.removeAllListeners("amount_changed");
        };
    }, []);
    return (
        <>
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex justify-between items-center"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ffa400]/20 border border-[#ffa400]/50 rounded-lg">
                        <ImStack size={24} color="#ffa400" />
                    </div>
                    <div className="text-sm ">
                        <h2 className="text-white font-bold">
                            {accumulated_odds.length} Leg Accumulator Slip
                        </h2>
                        <p className="text-xs">
                            Pari-Mutual pool {accumulated_odds.length} Match
                            Selected
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col gap-1 items-end">
                        <div className=" text-white/80 flex items-center gap-2">
                            <p className="text-xs">
                                {accumulated_odds.length === 0
                                    ? "None"
                                    : accumulated_odds.length === 1
                                      ? "Single"
                                      : "Accumulated"}
                            </p>
                            <p className="text-xs">{total_odds}x</p>
                        </div>

                        <h2 className="flex items-center gap-2">
                            <div className=" text-white/80  text-xs flex flex-col items-end justify-end ">
                                <p>
                                    {" "}
                                    stake amount :{" "}
                                    <span className="font-bold">
                                        {" "}
                                        ₦{amount}
                                    </span>
                                </p>
                                <p>
                                    potential earnings :{" "}
                                    <span className="text-[#ffa400] font-bold ">
                                        ₦{amount * total_odds}
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

