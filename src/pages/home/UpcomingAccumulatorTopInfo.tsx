import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface Prop {
    id: string;
    show: boolean;
    status: string;
    // true when a leg is currently outside the allowed split
    at_risk?: boolean;
    setShow: (value: boolean) => void;
}

export default function UpcomingAccumulatorTopInfo({
    id,
    show,
    status,
    at_risk = false,
    setShow,
}: Prop) {
    return (
        <div onClick={() => setShow(!show)} className="cursor-pointer">
            <div className="flex items-center justify-between">
                <div className="text-[10px] flex flex-col items-start gap-1">
                    <p className="text-white/70 ">Id : #{id}</p>
                    <p className="text-white/70 ">Status : {status}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] ">
                    {at_risk && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                            may void
                        </span>
                    )}
                    <p>{show ? "UnShow" : "Show"} </p>
                    {show ? (
                        <div>
                            <IoIosArrowDown />
                        </div>
                    ) : (
                        <div>
                            <IoIosArrowUp />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
