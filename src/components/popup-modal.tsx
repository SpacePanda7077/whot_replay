import { useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaCopy } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import {
    FacebookShareButton,
    FacebookIcon,
    XShareButton,
    XIcon,
    WhatsappShareButton,
    WhatsappIcon,
    TelegramShareButton,
    TelegramIcon,
} from "react-share";

interface Prop {
    text: string;
    type: "SUCCESS" | "ERROR";
    setShow: (value: boolean) => void;
    shareUrl?: string;
    slipCode?: string; // when set, shown as a copyable code and added to the share text
}

export default function PopUpModal({
    text,
    type,
    setShow,
    shareUrl = window.location.href,
    slipCode,
}: Prop) {
    const [copied, setCopied] = useState(false);

    const shareMessage = slipCode
        ? `I just placed a bet on Whot Replay! Use my slip code ${slipCode} to place the same bet and win with me.`
        : "Come watch and bet on Whot Replay with me on Whot Africa. Win big!";

    const copySlip = async () => {
        if (!slipCode) return;
        try {
            await navigator.clipboard.writeText(slipCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy slip code:", err);
        }
    };

    // Rendered in a portal on <body> so it is always centered on the screen,
    // even if a parent has a transform / filter / overflow that would trap a
    // `fixed` element.
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-lg"
        >
            <div className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col items-center gap-4 overflow-y-auto rounded-lg border border-[#FFB800]/20 bg-[#370723] p-5 sm:max-w-md sm:gap-6 sm:p-8">
                <div className="h-20 w-20 shrink-0 sm:h-28 sm:w-28">
                    {type === "SUCCESS" && (
                        <FaCheck size="100%" color="#7FBF18" />
                    )}
                    {type === "ERROR" && <FcCancel size="100%" />}
                </div>

                <p className="text-center text-lg font-bold text-white break-words sm:text-2xl">
                    {text}
                </p>

                <button
                    onClick={() => setShow(false)}
                    className="w-full rounded bg-[#e53603] px-4 py-2 font-bold text-[#2e041d] shadow-[0_0_10px_2px_#e53603] transition-colors hover:bg-[#e53603]/80 sm:w-1/2"
                >
                    Close
                </button>

                {type === "SUCCESS" && (
                    <div className="mt-1 flex w-full flex-col items-center gap-3 border-t border-white/10 pt-4">
                        {slipCode && (
                            <div className="flex w-full flex-col items-center gap-1.5">
                                <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                                    Your slip code
                                </p>
                                <button
                                    onClick={copySlip}
                                    aria-label="Copy slip code"
                                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-[#FFB800]/60 bg-[#2E041D] px-4 py-3 transition-colors hover:bg-[#2E041D]/70"
                                >
                                    <span className="break-all text-left font-mono text-base font-bold tracking-widest text-[#FFB800] sm:text-lg">
                                        {slipCode}
                                    </span>
                                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-white/70">
                                        {copied ? (
                                            <>
                                                <FaCheck color="#7FBF18" />{" "}
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <FaCopy /> Copy
                                            </>
                                        )}
                                    </span>
                                </button>
                                <p className="text-center text-[11px] text-white/50">
                                    Friends can enter this code to place the
                                    same bet.
                                </p>
                            </div>
                        )}

                        <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                            Share with friends
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <WhatsappShareButton
                                url={shareUrl}
                                message={shareMessage}
                                aria-label="Share on WhatsApp"
                            >
                                <WhatsappIcon size={36} />
                            </WhatsappShareButton>

                            <XShareButton
                                url={shareUrl}
                                text={shareMessage}
                                aria-label="Share on X"
                            >
                                <XIcon size={36} />
                            </XShareButton>

                            <FacebookShareButton
                                url={shareUrl}
                                hashtag="#WhotReplay"
                                aria-label="Share on Facebook"
                            >
                                <FacebookIcon size={36} />
                            </FacebookShareButton>

                            <TelegramShareButton
                                url={shareUrl}
                                text={shareMessage}
                                aria-label="Share on Telegram"
                            >
                                <TelegramIcon size={36} />
                            </TelegramShareButton>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}
