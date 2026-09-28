import { useEffect, useState } from "react";

interface Prop {
    id: string;
    status: string;
    time: {
        open_at: string;
        close_at: string;
    };
    refetch: () => void;
}
export default function UpcomingMatchTopInfo({
    id,
    status,
    time,
    refetch,
}: Prop) {
    const [openTime, setOpenTime] = useState({ min: 0, sec: 0 });
    const [closeTime, setCloseTime] = useState({ min: 0, sec: 0 });
    useEffect(() => {
        const timer = setInterval(() => {
            const { minutes: openMin, seconds: openSec } = getTimeRemaining(
                time.open_at,
            );

            const { minutes: closeMin, seconds: closeSec } = getTimeRemaining(
                time.close_at,
            );
            setOpenTime({ min: openMin, sec: openSec });
            setCloseTime({ min: closeMin, sec: closeSec });
            if (openMin === 0 && openSec === 0) {
                refetch();
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <>
            <div>
                <div className="flex items-center justify-between">
                    <div className="text-[10px] flex items-center gap-2">
                        <div
                            style={{
                                backgroundColor:
                                    status === "scheduled" ? "orange" : "green",
                                color:
                                    status === "scheduled"
                                        ? "#2E071B"
                                        : "white",
                            }}
                            className="flex gap-2 items-center  w-fit py-1 px-2 rounded-lg font-bold"
                        >
                            <p>{status}</p>
                        </div>
                        <p className="text-white/70 ">#{id}</p>
                    </div>
                    <div className="text-[10px]">
                        {status === "scheduled"
                            ? "Bet starts in : "
                            : status === "open"
                              ? "Bet locks at :"
                              : " bet opened "}

                        <div className="text-white font-bold">
                            {status === "scheduled"
                                ? `${openTime.min}: ${openTime.sec}`
                                : status === "open"
                                  ? `${closeTime.min}: ${closeTime.sec}`
                                  : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function getTimeRemaining(date: string) {
    const remainingMs = Math.max(0, new Date(date).getTime() - Date.now());

    const totalSeconds = Math.floor(remainingMs / 1000);

    return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
    };
}

