import { useState } from "react";
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

    return (
        <div className="z-50 fixed top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center backdrop-blur-lg shadow-black shadow-lg">
            <div className="flex flex-col justify-center items-center gap-6 bg-[#370723] border border-[#FFB800]/20 rounded-lg h-auto p-10 w-[95vw] md:w-[60vw] lg:w-[35vw] max-h-[90vh] overflow-y-auto">
                {type === "SUCCESS" && <FaCheck size={128} color="#7FBF18" />}
                {type === "ERROR" && <FcCancel size={128} color="#bf1818" />}

                <p className="text-white text-xl md:text-2xl font-bold text-center">
                    {text}
                </p>

                <button
                    onClick={() => setShow(false)}
                    className="shadow-[0_0_10px_2px_#e53603] w-1/2 bg-[#e53603] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#e53603]/80 transition-colors"
                >
                    Close
                </button>

                {type === "SUCCESS" && (
                    <div className="flex flex-col items-center gap-3 mt-2 w-full border-t border-white/10 pt-4">
                        {slipCode && (
                            <div className="w-full flex flex-col items-center gap-1.5">
                                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                                    Your slip code
                                </p>
                                <button
                                    onClick={copySlip}
                                    aria-label="Copy slip code"
                                    className="flex items-center justify-between gap-3 w-full bg-[#2E041D] border border-dashed border-[#FFB800]/60 rounded-lg px-4 py-3 hover:bg-[#2E041D]/70 transition-colors"
                                >
                                    <span className="text-[#FFB800] font-mono font-bold text-lg tracking-widest break-all text-left">
                                        {slipCode}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-white/70 shrink-0">
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
                                <p className="text-white/50 text-[11px] text-center">
                                    Friends can enter this code to place the
                                    same bet.
                                </p>
                            </div>
                        )}

                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                            Share with friends
                        </p>

                        <div className="flex items-center gap-3">
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
        </div>
    );
}
