import { FaCheckCircle, FaStar } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { BsShieldFillPlus } from "react-icons/bs";
import { HiUsers } from "react-icons/hi2";

export default function Experience() {
    return (
        <>
            <div className="pt-10 px-4 flex items-center justify-between gap-10 w-full bg-[url('/assets/react/landing-1.png')] bg-cover ">
                <div className="relative hidden lg:flex pl-10 w-full">
                    <img
                        src="assets/react/phone.svg"
                        className="max-w-50 relative z-20"
                    />
                    <div className="absolute left-50 bottom-0">
                        <img
                            src="assets/react/card.svg"
                            className="max-w-50 -z-200"
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="text-start text-2xl text-white font-bold">
                        <h1>Immerse Yourself in a</h1>
                        <h1>
                            {" "}
                            <span className="text-[#FFB800]">
                                Modern Gaming
                            </span>{" "}
                            Experience
                        </h1>
                    </div>
                    <p className="text-xs text-start">
                        Over 200 entertaining titles, a digitized Whot card
                        game, and a global community
                        <br /> — all in the palm of your hand.
                    </p>
                    <div className="mt-10 grid grid-cols-2 text-white font-bold gap-5 md:grid-cols-4 justify-between items-center">
                        <div className="flex items-center w-full gap-2">
                            <div className="p-2 bg-[#550237] rounded-lg border border-[#FFB800]">
                                <IoGameController size={32} color="#FFB800" />
                            </div>
                            <p className="text-xs">Offline & Online Modes</p>
                        </div>
                        <div className="flex items-center w-full gap-2">
                            <div className="p-2 bg-[#550237] rounded-lg border border-[#FFB800]">
                                <BsShieldFillPlus size={32} color="#FFB800" />
                            </div>
                            <p className="text-xs">User Friendly Controls</p>
                        </div>
                        <div className="flex items-center w-full gap-2">
                            <div className="p-2 bg-[#550237] rounded-lg border border-[#FFB800]">
                                <FaStar size={32} color="#FFB800" />
                            </div>
                            <p className="text-xs">Classic Digital Fusion</p>
                        </div>
                        <div className="flex items-center w-full gap-2">
                            <div className="p-2 bg-[#550237] rounded-lg border border-[#FFB800]">
                                <HiUsers size={32} color="#FFB800" />
                            </div>
                            <p className="text-xs">Connect With Friends</p>
                        </div>
                    </div>
                </div>

                <div className="w-full hidden lg:block">
                    <div className="flex flex-col gap-4 bg-[#25021D] px-4 py-5 rounded-lg">
                        <h1 className="text-lg font-bold">
                            Why play{" "}
                            <span className="text-[#FFB800]">Whot Africa?</span>
                        </h1>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={24} color="#FFB800" /> Real
                                Cash Prize
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={24} color="#FFB800" />
                                Play Anytime, Anywhere
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={24} color="#FFB800" />
                                Smooth Experience
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={24} color="#FFB800" />{" "}
                                Compete with players Across Nigeria
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

