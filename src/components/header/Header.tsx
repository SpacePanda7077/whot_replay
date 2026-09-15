import { CiWallet } from "react-icons/ci";
import { GiScrollUnfurled } from "react-icons/gi";
import { MdLiveTv } from "react-icons/md";
import { RiChatHistoryFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router";
import { useAuth } from "../../store/auth-store";
import SideBar from "./sideBar";
import { useState } from "react";
import { motion } from "motion/react";

export default function Header() {
    const navigate = useNavigate();
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const log = useAuth((s) => s.login_result);
    return (
        <>
            <div className="fixed left-0 top-0 w-full flex justify-between items-center py-4 px-4 border-b border-b-[#ffa500]/90 bg-white/5 backdrop-blur-lg text-white z-1000">
                <div className="flex gap-2 items-center">
                    <img
                        src="assets/react/logo.png"
                        alt="logo"
                        className="w-[48px]"
                    />
                    <div>
                        <h1 className="font-bold text-sm">
                            Whot Africa{" "}
                            <span className="text-[#ffb800]">Replay</span>
                        </h1>
                        <p className="text-xs text-white/40">Pari Mutual</p>
                    </div>
                </div>
                <div className="flex gap-6 font-semibold text-sm items-center hidden lg:flex">
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
                    <div className="hidden lg:flex items-center gap-5">
                        <div className="flex gap-2 items-center bg-white/10 py-1 px-2 border font-bold border-white/20 rounded-lg">
                            <CiWallet size={24} color="#FFB800" />
                            {Number(25400).toLocaleString()}
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
                    <div className="hidden lg:flex items-center gap-5">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/login")}
                            className="bg-[#ffb800] px-4 py-1 rounded-lg text-[#3B0526] font-bold"
                        >
                            Login
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/register")}
                            className="bg-[#ffb800] px-4 py-1 rounded-lg text-[#3B0526] font-bold"
                        >
                            Sign Up
                        </motion.button>
                    </div>
                )}

                <div
                    onClick={() => setSideBarOpen((prev) => !prev)}
                    className="lg:hidden"
                >
                    <RxHamburgerMenu color="#FFB800" size={24} />
                </div>
                {sidebarOpen && <SideBar />}
            </div>
        </>
    );
}

