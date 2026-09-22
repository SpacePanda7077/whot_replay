import { CiWallet } from "react-icons/ci";
import { GiScrollUnfurled } from "react-icons/gi";
import { MdLiveTv } from "react-icons/md";
import { RiChatHistoryFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router";
import { useAuth } from "../../store/auth-store";
import { useWalletStore } from "../../store/wallet-store";

export default function SideBar() {
    const navigate = useNavigate();
    const wallet = useWalletStore((s) => s.wallet);

    const log = useAuth((s) => s.login_result);
    return (
        <>
            <div className="fixed mt-20 left-0 top-0 w-fit h-auto flex flex-col gap-10 items-center py-4 px-4 border-b border-b-[#ffa500]/90 bg-[#2c071a] border border-[#FFB800] backdrop-blur-lg text-white z-1000">
                <div className="flex gap-10 font-semibold text-sm items-center lg:hidden flex-col">
                    <span
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <MdLiveTv size={18} color="orange" /> <p>Live Replay</p>
                    </span>
                    <span
                        onClick={() => navigate("/my-stakes")}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <GiScrollUnfurled size={18} color="#D19988" />{" "}
                        <p>My Stakes</p>
                    </span>
                    <span
                        onClick={() => navigate("/whot-africa")}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <RiChatHistoryFill size={18} color="#ffb800" />{" "}
                        <p>whot africa</p>
                    </span>
                </div>
                {log && (
                    <div className="flex lg:hidden items-center gap-5">
                        <div className="flex gap-2 items-center bg-white/10 py-1 px-2 border font-bold border-white/20 rounded-lg">
                            <CiWallet size={24} color="#FFB800" />
                            {wallet?.balance.toLocaleString() || 0}
                        </div>
                        <button
                            onClick={() => navigate("/wallet")}
                            className="bg-[#ffb800] px-4 py-1 rounded-lg text-[#3B0526] font-bold"
                        >
                            Deposit
                        </button>
                    </div>
                )}
                {!log && (
                    <div className="flex lg:hidden items-center gap-5">
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#ffb800] px-4 py-1 rounded-lg text-[#3B0526] font-bold"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-[#ffb800] px-4 py-1 rounded-lg text-[#3B0526] font-bold"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

