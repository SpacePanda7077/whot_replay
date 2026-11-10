import { useEffect, useRef, useState } from "react";

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

    // always call the latest refetch without restarting the interval
    const refetchRef = useRef(refetch);
    refetchRef.current = refetch;

    useEffect(() => {
        let lastFetch = 0;

        const tick = () => {
            const open = getTimeRemaining(time.open_at);
            const close = getTimeRemaining(time.close_at);

            setOpenTime({ min: open.minutes, sec: open.seconds });
            setCloseTime({ min: close.minutes, sec: close.seconds });

            // only watch the countdown that matches the current status
            const target =
                status === "scheduled"
                    ? open
                    : status === "open"
                      ? close
                      : null;

            // at 0:0 refetch, and retry every 3s until the server status changes
            if (
                target &&
                target.minutes === 0 &&
                target.seconds === 0 &&
                Date.now() - lastFetch > 3000
            ) {
                lastFetch = Date.now();
                refetchRef.current();
            }
        };

        tick();
        const timer = setInterval(tick, 1000);

        return () => clearInterval(timer);
    }, [status, time.open_at, time.close_at]);

    return (
        <>
            <div>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 text-[10px]">
                        <div
                            style={{
                                backgroundColor:
                                    status === "scheduled" ? "orange" : "green",
                                color:
                                    status === "scheduled"
                                        ? "#2E071B"
                                        : "white",
                            }}
                            className="flex gap-2 items-center w-fit py-1 px-2 rounded-lg font-bold"
                        >
                            <p>{status}</p>
                        </div>
                        <p className="text-white/70">#{id}</p>
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
