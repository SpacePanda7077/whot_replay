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
        <div className="flex flex-col gap-2 bg-[#2E041D] p-4 rounded-lg border border-[#FFB800]/20">
            <div className="flex justify-between text-xs">
                <p className="bg-white/5 px-4 py-1 rounded-lg font-semibold">
                    {acc ? "Accumulator" : "Single"}
                </p>
                <div
                    className={`font-semibold uppercase ${STATUS_STYLE[status] ?? ""}`}
                >
                    {status}
                </div>
            </div>
            <div className="flex items-center justify-between border-b border-b-white/20 pb-4">
                <div className="flex gap-2 items-center">
                    <div>
                        {acc && bet.combo ? (
                            <div className="flex gap-2 items-center">
                                players :{" "}
                                {bet.legs.map((t, i) => (
                                    <p
                                        style={{
                                            backgroundColor:
                                                t.player?.player_index === 0
                                                    ? "orange"
                                                    : "#0AB2C4",
                                        }}
                                        key={i}
                                        className="font-semibold p-1 rounded-lg text-[#2E041D]"
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
                                className="font-semibold capitalize w-fit p-1 rounded-lg text-[#2E041D] "
                            >
                                {bet.player!.full_name}
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
                {acc && bet.combo && (
                    <div className="flex items-center gap-2">
                        slip code : {bet.slip_code}{" "}
                        <FaCopy
                            color={color}
                            onClick={() => copy_slip(bet.slip_code)}
                        />
                    </div>
                )}
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

