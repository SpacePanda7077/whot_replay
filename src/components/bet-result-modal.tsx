import { FaCheck, FaUndo } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { bet, bet_key, is_accumulator, single_team } from "../store/history";

interface Prop {
    results: bet[];
    onClose: () => void;
}

const money = (n: number) => `₦${n.toLocaleString()}`;

// Same colors as the stake cards: player_index 0 = orange, 1 = blue.
const chip_color = (player_index?: number) =>
    player_index === 0 ? "orange" : "#0AB2C4";

function PlayerChip({
    name,
    player_index,
}: {
    name?: string;
    player_index?: number;
}) {
    return (
        <span
            style={{ backgroundColor: chip_color(player_index) }}
            className="font-semibold capitalize w-fit max-w-full px-2 py-0.5 rounded-lg text-[#2E041D] break-words [overflow-wrap:anywhere]"
        >
            {name ?? "Unknown player"}
        </span>
    );
}

function BetInfo({ b }: { b: bet }) {
    const acc = is_accumulator(b);

    // Fallback for singles when `player` is missing: use the side backed.
    const side = single_team(b);
    const single_index =
        b.player?.player_index ??
        (side === "orange" ? 0 : side === "blue" ? 1 : undefined);

    return (
        <div className="flex flex-col gap-2 bg-[#610240] p-3 rounded-lg text-xs text-white/80 min-w-0">
            <div className="flex justify-between items-center gap-2">
                <p className="bg-white/10 px-3 py-0.5 rounded-lg font-semibold text-white">
                    {acc ? "Accumulator" : "Single"}
                </p>

                {b.status === "won" && (
                    <p className="font-bold text-green-400">
                        WON {money(b.payout)}
                    </p>
                )}
                {b.status === "lost" && (
                    <p className="font-bold text-red-400">
                        LOST {money(b.amount)}
                    </p>
                )}
                {b.status === "refunded" && (
                    <p className="font-bold text-[#FFB800]">
                        REFUNDED {money(b.amount)}
                    </p>
                )}
            </div>

            {acc ? (
                <div className="flex flex-col gap-1.5">
                    {b.legs?.map((leg, i) => (
                        <div
                            key={i}
                            className="flex flex-wrap items-center gap-2 min-w-0"
                        >
                            <span className="shrink-0">
                                Game #{leg.game_id}
                            </span>
                            <PlayerChip
                                name={leg.player?.full_name}
                                player_index={leg.player?.player_index}
                            />
                        </div>
                    ))}
                    {b.combo && <p>Combo: {b.combo}</p>}
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="shrink-0">Game #{b.game_id}</span>
                    <PlayerChip
                        name={b.player?.full_name}
                        player_index={single_index}
                    />
                </div>
            )}

            <div className="flex flex-wrap justify-between gap-2 text-[11px] text-white/60">
                <p># {b.id}</p>
                <p>Stake {money(b.amount)}</p>
                {acc && b.slip_code && <p>Slip: {b.slip_code}</p>}
            </div>
        </div>
    );
}

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

                {isRefunded && (
                    <div className="w-full rounded-lg border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-3 text-center">
                        <p className="text-[#FFB800] text-sm md:text-base font-semibold leading-snug">
                            {results.length > 1
                                ? "These bets are being refunded because the games were too lopsided."
                                : "Your bet is being refunded because the game was too lopsided."}
                        </p>
                        <p className="mt-1.5 text-white/80 text-xs md:text-sm">
                            Please wait for the next game.
                        </p>
                    </div>
                )}

                <div className="w-full flex flex-col gap-2">
                    {results.map((b) => (
                        <BetInfo key={bet_key(b)} b={b} />
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
