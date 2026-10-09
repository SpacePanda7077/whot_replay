import { bet, is_accumulator } from "../../store/history";

interface Prop {
    bet: bet;
}

const TEAM_NAMES: Record<string, string> = {
    O: "Orange",
    B: "Blue",
};

const STATUS_STYLE: Record<string, string> = {
    placed: "text-[#FFB800]",
    won: "text-green-400",
    lost: "text-red-400",
    refunded: "text-white/50",
};

export default function StakeComponent({ bet }: Prop) {
    const acc = is_accumulator(bet);

    return (
        <div className="flex flex-col gap-2 bg-[#2E041D] p-4 rounded-lg border border-[#FFB800]/20">
            <div className="flex justify-between text-xs">
                <p className="bg-white/5 px-4 py-1 rounded-lg font-semibold">
                    {acc ? "Accumulator" : "Single"}
                </p>
                <div
                    className={`font-semibold uppercase ${STATUS_STYLE[bet.status] ?? ""}`}
                >
                    {bet.status}
                </div>
            </div>
            <div className="flex items-center justify-between border-b border-b-white/20 pb-4">
                <div className="flex gap-2 items-center">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            !acc && bet.team === "blue"
                                ? "bg-blue-500"
                                : "bg-orange-500"
                        }`}
                    ></div>
                    <div>
                        {acc && bet.combo ? (
                            <div className="flex gap-2 items-center">
                                teams :{" "}
                                {bet.combo.split("").map((t, i) => (
                                    <p key={i} className="font-semibold">
                                        {TEAM_NAMES[t] ?? t}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="font-semibold capitalize">
                                Team {bet.team}
                            </p>
                        )}
                        <p className="text-xs">
                            # {bet.id} · {formatTimeAgo(bet.createdtime)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-white font-bold">₦{bet.amount}</p>
                    {bet.status === "won" && (
                        <p className="text-xs text-green-400">
                            won ₦{bet.payout}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center text-xs">
                <p>game id : {bet.game_id || bet.accumulator_id}</p>
                <p>slip code : {bet.slip_code}</p>
            </div>
        </div>
    );
}

function formatTimeAgo(timestamp: string): string {
    const createdDate = new Date(timestamp);
    const diffInMs = Date.now() - createdDate.getTime();

    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) {
        return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
    }
    if (diffInHours < 24) {
        return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    }
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}
