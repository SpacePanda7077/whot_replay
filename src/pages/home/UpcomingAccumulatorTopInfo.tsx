interface Prop {
    id: string;
    status: string;
    // how many of the 3 matches have a pick
    picked: number;
    total: number;
    // true when a leg is currently outside the allowed split
    at_risk?: boolean;
}

// Same layout as UpcomingMatchTopInfo: status badge + id on the left,
// a small info block on the right (picks progress instead of a countdown).
export default function UpcomingAccumulatorTopInfo({
    id,
    status,
    picked,
    total,
    at_risk = false,
}: Prop) {
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="text-[10px] flex items-center gap-2">
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
                <div className="text-[10px]">
                    {status === "scheduled"
                        ? "Bet not open yet"
                        : status === "open"
                          ? `Pick all ${total} matches :`
                          : " bet closed "}

                    {status === "open" && (
                        <div className="text-white font-bold">
                            {picked}/{total}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
