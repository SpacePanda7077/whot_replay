import { useEffect, useRef, useState } from "react";
import { getTimeRemaining } from "./UpcomingMatchTopInfo";

interface Prop {
    id: string;
    status: string;
    // how many of the 3 matches have a pick
    picked: number;
    total: number;
    // true when a leg is currently outside the allowed split
    at_risk?: boolean;
    // When betting opens / locks for this accumulator. Taken from its first
    // leg (an accumulator locks when its first leg starts).
    time: {
        open_at?: string;
        close_at?: string;
    };
    refetch: () => void;
}

const pad = (n: number) => n.toString().padStart(2, "0");

// Same layout as UpcomingMatchTopInfo: status badge + id on the left,
// a countdown block on the right (plus picks progress while open).
export default function UpcomingAccumulatorTopInfo({
    id,
    status,
    picked,
    total,
    at_risk = false,
    time,
    refetch,
}: Prop) {
    const [left, setLeft] = useState<{ min: number; sec: number } | null>(null);

    // always call the latest refetch without restarting the interval
    const refetchRef = useRef(refetch);
    refetchRef.current = refetch;

    // scheduled -> count down to open, open -> count down to lock
    const target_at =
        status === "scheduled"
            ? time.open_at
            : status === "open"
              ? time.close_at
              : undefined;

    useEffect(() => {
        if (!target_at) {
            setLeft(null);
            return;
        }

        let lastFetch = 0;

        const tick = () => {
            const { minutes, seconds } = getTimeRemaining(target_at);
            setLeft({ min: minutes, sec: seconds });

            // at 0:00 refetch, and retry every 3s until the server status changes
            if (
                minutes === 0 &&
                seconds === 0 &&
                Date.now() - lastFetch > 3000
            ) {
                lastFetch = Date.now();
                refetchRef.current();
            }
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [status, target_at]);

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] flex min-w-0 items-center gap-2">
                    <div
                        style={{
                            backgroundColor:
                                status === "scheduled" ? "orange" : "green",
                            color: status === "scheduled" ? "#2E071B" : "white",
                        }}
                        className="flex gap-2 items-center w-fit py-1 px-2 rounded-lg font-bold"
                    >
                        <p>{status}</p>
                    </div>
                    <p className="text-white/70">#{id}</p>
                    {at_risk && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                            may void
                        </span>
                    )}
                </div>
                <div className="text-[10px] text-right shrink-0">
                    {status === "scheduled"
                        ? left
                            ? "Bet starts in : "
                            : "Bet not open yet"
                        : status === "open"
                          ? "Bet locks in :"
                          : " bet closed "}

                    {left && (status === "scheduled" || status === "open") && (
                        <div className="text-white font-bold">
                            {pad(left.min)}:{pad(left.sec)}
                        </div>
                    )}

                    {status === "open" && (
                        <p className="text-white/70">
                            Picked {picked}/{total}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
