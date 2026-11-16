import { FaCheck, FaUndo } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { bet } from "../store/history";

interface Prop {
    results: bet[];
    onClose: () => void;
}

const money = (n: number) => `₦${n.toLocaleString()}`;

export default function BetResultModal({ results, onClose }: Prop) {
    const all = (status: string) => results.every((b) => b.status === status);
    const won_total = results
        .filter((b) => b.status === "won")
        .reduce((sum, b) => sum + b.payout, 0);
    const lost_total = results
        .filter((b) => b.status === "lost")
        .reduce((sum, b) => sum + b.amount, 0);
    const refunded_total = results
        .filter((b) => b.status === "refunded")
        .reduce((sum, b) => sum + b.amount, 0);

    const isRefunded = all("refunded");

    let title = "GAME RESULT";
    if (all("won")) title = `YOU WON ${money(won_total)}`;
    else if (all("lost")) title = `YOU LOST ${money(lost_total)}`;
    else if (isRefunded) title = `BET REFUNDED ${money(refunded_total)}`;

    return (
        <div className="z-50 mt-10 fixed top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center backdrop-blur-lg">
            <div className="flex flex-col items-center gap-5 bg-[#370723] border border-[#FFB800]/20 rounded-lg p-8 w-[95vw] md:w-[60vw] lg:w-[35vw] max-h-[85vh] overflow-y-auto">
                {all("won") && <FaCheck size={96} color="#7FBF18" />}
                {all("lost") && <FcCancel size={96} />}
                {isRefunded && <FaUndo size={80} color="#FFB800" />}

                <p className="text-white text-xl md:text-2xl font-bold text-center">
                    {title}
                </p>

                {/* Shown first for refunded games – reason + next-game instruction */}
                {isRefunded && (
                    <div className="w-full rounded-lg border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-3 text-center">
                        <p className="text-[#FFB800] text-sm md:text-base font-semibold leading-snug">
                            Your bets are being refunded because the game was
                            too lopsided.
                        </p>
                        <p className="mt-1.5 text-white/80 text-xs md:text-sm">
                            Please wait for the next game.
                        </p>
                    </div>
                )}

                <div className="w-full flex flex-col gap-2">
                    {results.map((b) => (
                        <div
                            key={b.id}
                            className="flex justify-between items-center bg-[#610240] p-2 rounded-lg text-xs text-white/80"
                        >
                            <p>
                                Team{" "}
                                <span className="font-bold capitalize">
                                    {b.team}
                                </span>{" "}
                                · {money(b.amount)}
                            </p>
                            {b.status === "won" && (
                                <p className="font-bold text-green-400">
                                    WON {money(b.payout)}
                                </p>
                            )}
                            {b.status === "lost" && (
                                <p className="font-bold text-red-400">LOST</p>
                            )}
                            {b.status === "refunded" && (
                                <p className="font-bold text-[#FFB800]">
                                    REFUNDED {money(b.amount)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="shadow-[0_0_10px_2px_#e53603] w-1/2 bg-[#e53603] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#e53603]/80"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

