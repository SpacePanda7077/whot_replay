import { createPortal } from "react-dom";
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
            className="w-fit max-w-full rounded-lg px-2 py-0.5 font-semibold capitalize text-[#2E041D] break-words [overflow-wrap:anywhere]"
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
        <div className="flex min-w-0 flex-col gap-2 rounded-lg bg-[#610240] p-3 text-xs text-white/80">
            <div className="flex items-center justify-between gap-2">
                <p className="rounded-lg bg-white/10 px-3 py-0.5 font-semibold text-white">
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
                            className="flex min-w-0 flex-wrap items-center gap-2"
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
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="shrink-0">Game #{b.game_id}</span>
                    <PlayerChip
                        name={b.player?.full_name}
                        player_index={single_index}
                    />
                </div>
            )}

            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] text-white/60">
                <p className="break-all"># {b.id}</p>
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

    // Rendered in a portal on <body> so it is always centered on the screen,
    // even if a parent has a transform / filter / overflow that would trap a
    // `fixed` element.
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-lg"
        >
            <div className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col items-center gap-4 overflow-y-auto rounded-lg border border-[#FFB800]/20 bg-[#370723] p-5 sm:max-w-md sm:gap-5 sm:p-8">
                <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                    {all("won") && <FaCheck size="100%" color="#7FBF18" />}
                    {all("lost") && <FcCancel size="100%" />}
                    {isRefunded && <FaUndo size="100%" color="#FFB800" />}
                </div>

                <p className="text-center text-lg font-bold text-white sm:text-2xl">
                    {title}
                </p>

                {isRefunded && (
                    <div className="w-full rounded-lg border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-3 text-center">
                        <p className="text-sm font-semibold leading-snug text-[#FFB800] sm:text-base">
                            {results.length > 1
                                ? "These bets are being refunded because the games were too lopsided."
                                : "Your bet is being refunded because the game was too lopsided."}
                        </p>
                        <p className="mt-1.5 text-xs text-white/80 sm:text-sm">
                            Please wait for the next game.
                        </p>
                    </div>
                )}

                <div className="flex w-full flex-col gap-2">
                    {results.map((b) => (
                        <BetInfo key={bet_key(b)} b={b} />
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full rounded bg-[#e53603] px-4 py-2 font-bold text-[#2e041d] shadow-[0_0_10px_2px_#e53603] hover:bg-[#e53603]/80 sm:w-1/2"
                >
                    Close
                </button>
            </div>
        </div>,
        document.body,
    );
}
