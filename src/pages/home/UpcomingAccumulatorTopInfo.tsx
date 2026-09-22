import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface Prop {
    id: string;
    show: boolean;
    setShow: (value: boolean) => void;
}
export default function UpcomingAccumulatorTopInfo({
    id,
    show,
    setShow,
}: Prop) {
    return (
        <>
            <div onClick={() => setShow(!show)}>
                <div className="flex items-center justify-between">
                    <div className="text-[10px] flex items-center gap-4">
                        <p className="text-white/70 ">#{id}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] ">
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
        </>
    );
}

