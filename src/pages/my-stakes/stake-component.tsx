import { bet } from "../../store/history";

interface Prop {
    bet: bet;
}

export default function StakeComponent({ bet }: Prop) {
    return (
        <>
            <div className="flex flex-col gap-2 bg-[#2E041D] p-4 rounded-lg border border-[#FFB800]/20">
                <div className="flex justify-between text-xs">
                    <p className="bg-white/5 px-4 py-1 rounded-lg font-semibold">
                        single
                    </p>
                    <div>{bet.status}</div>
                </div>
                <div className="flex items-center justify-between border-b border-b-white/20 pb-4">
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                            <p className="font-semibold">Team {bet.team}</p>
                            <p className="text-xs">
                                # {bet.id} · {formatTimeAgo(bet.createdtime)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-white font-bold">₦{bet.amount}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <p>game id : {bet.game_id}</p>
                    <p>slip code : {bet.slip_code}</p>
                </div>
            </div>
        </>
    );
}

function formatTimeAgo(timestamp: string): string {
    const createdDate = new Date(timestamp);
    const now = new Date();

    // Calculate difference in milliseconds
    const diffInMs = now.getTime() - createdDate.getTime();

    // Convert to target time units
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Handle time fragments
    if (diffInMins < 1) {
        return "Just now";
    }
    if (diffInMins < 60) {
        return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
    }
    if (diffInHours < 24) {
        return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    }

    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}

