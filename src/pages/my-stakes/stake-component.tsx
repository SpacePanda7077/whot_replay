import { FaCopy } from "react-icons/fa";
import { bet, is_accumulator } from "../../store/history";
import { useDisplayStatus } from "./bet-status";
import { useState } from "react";

interface Prop {
    bet: bet;
}

const TEAM_NAMES: Record<string, string> = {
    O: "Orange",
    B: "Blue",
};

const STATUS_STYLE: Record<string, string> = {
    placed: "text-[#FFB800]",
    playing: "text-sky-400 animate-pulse",
    won: "text-green-400",
    lost: "text-red-400",
    refunded: "text-white/50",
};

export default function StakeComponent({ bet }: Prop) {
    const acc = is_accumulator(bet);
    const status = useDisplayStatus(bet);
    const [copied, setCopied] = useState(false);
    const [color, setColor] = useState("white");

    const copy_slip = async (slip: string) => {
        try {
            await navigator.clipboard.writeText(slip);
            setCopied(true);
            setColor("#FFB800");

            // Reset the button text after 2 seconds
            setTimeout(() => {
                setCopied(false);
                setColor("white");
            }, 2000);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    return (
        <div className="flex flex-col gap-2 bg-[#2E041D] p-4 rounded-lg border border-[#FFB800]/20 w-full min-w-0 overflow-hidden">
            <div className="flex justify-between gap-2 text-xs">
                <p className="bg-white/5 px-4 py-1 rounded-lg font-semibold">
                    {acc ? "Accumulator" : "Single"}
                </p>
                <div
                    className={`font-semibold uppercase shrink-0 ${STATUS_STYLE[status] ?? ""}`}
                >
                    {status}
                </div>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-b-white/20 pb-4">
                {/* min-w-0 + flex-1 lets this column shrink and wrap instead of overflowing */}
                <div className="flex gap-2 items-center min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                        {acc && bet.combo ? (
                            <div className="flex flex-wrap gap-2 items-center min-w-0">
                                <span className="shrink-0">players :</span>
                                {bet.legs.map((t, i) => (
                                    <p
                                        style={{
                                            backgroundColor:
                                                t.player?.player_index === 0
                                                    ? "orange"
                                                    : "#0AB2C4",
                                        }}
                                        key={i}
                                        className="font-semibold p-1 rounded-lg text-[#2E041D] max-w-full break-words [overflow-wrap:anywhere]"
                                    >
                                        {t.player.full_name}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p
                                style={{
                                    backgroundColor:
                                        bet.player?.player_index === 0
                                            ? "orange"
                                            : "#0AB2C4",
                                }}
                                className="font-semibold capitalize w-fit max-w-full p-1 rounded-lg text-[#2E041D] break-words [overflow-wrap:anywhere]"
                            >
                                {bet.player!.full_name}
                            </p>
                        )}
                        <p className="text-xs mt-1 break-words">
                            # {bet.id} · {formatTimeAgo(bet.createdtime)}
                        </p>
                    </div>
                </div>
                {/* Amount column never shrinks, so it stays visible on small screens */}
                <div className="flex flex-col items-end shrink-0">
                    <p className="text-white font-bold">₦{bet.amount}</p>
                    {bet.status === "won" && (
                        <p className="text-xs text-green-400">
                            won ₦{bet.payout}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                <p className="min-w-0 break-all">
                    game id : {bet.game_id || bet.accumulator_id}
                </p>
                {acc && bet.combo && (
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="break-all">
                            slip code : {bet.slip_code}
                        </span>
                        <FaCopy
                            className="shrink-0 cursor-pointer"
                            color={color}
                            onClick={() => copy_slip(bet.slip_code)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export function formatTimeAgo(timestamp: string): string {
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

