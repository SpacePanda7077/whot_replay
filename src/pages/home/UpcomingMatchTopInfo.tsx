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
            if (openMin === 0 && openSec === 0) {
                refetch();
            }
            const { minutes: closeMin, seconds: closeSec } = getTimeRemaining(
                time.open_at,
            );
            setOpenTime({ min: openMin, sec: openSec });
            setCloseTime({ min: closeMin, sec: closeSec });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <>
            <div>
                <div className="flex items-center justify-between">
                    <div className="text-[10px] flex items-center gap-4">
                        <div className="flex gap-2 items-center text-white/60 bg-white/10 w-fit py-1 px-2 rounded-lg">
                            <p>{status}</p>
                        </div>
                        <p className="text-white/70 ">#{id}</p>
                    </div>
                    <div className="text-[10px]">
                        {status === "scheduled"
                            ? "Betting starts in : "
                            : "Betting closes : "}

                        <div>
                            {status === "scheduled"
                                ? `${openTime.min}: ${openTime.sec}`
                                : `${closeTime.min}: ${closeTime.sec}`}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
const betsOpenAt = "2026-09-10T09:57:00Z";

function getTimeRemaining(date: string) {
    const remainingMs = Math.max(0, new Date(date).getTime() - Date.now());

    const totalSeconds = Math.floor(remainingMs / 1000);

    return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
    };
}

console.log(getTimeRemaining(betsOpenAt));

