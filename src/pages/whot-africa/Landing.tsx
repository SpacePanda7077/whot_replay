import { IoLogoGooglePlaystore, IoPhonePortraitOutline } from "react-icons/io5";
import { PiAppStoreLogoBold } from "react-icons/pi";

export default function Landing() {
    const redirectToPlayStore = () => {
        // Replace 'com.example.yourpackagename' with your actual app package ID
        const appId = "com.whotafrica";

        window.location.href = `https://play.google.com/store/apps/details?id=com.whotafrica&pcampaignid=web_share`;
    };
    const redirectToAppStore = () => {
        // Replace 'com.example.yourpackagename' with your actual app package ID
        const appId = "com.whotafrica";

        window.location.href = `https://apps.apple.com/us/app/whot-africa/id1491486672`;
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <>
            <div className="relative flex gap-10 w-full py-4">
                <div className="w-full flex flex-col gap-6 items-center justify-center">
                    <div className="bg-[#FFB800]/20 w-fit px-4 py-1 rounded-3xl border border-[#FFB800] text-[#FFB800]">
                        Premier Mobile Gaming
                    </div>
                    <h1 className="text-6xl text-white font-bold">
                        Play to <span className="text-[#FFB800]">Win</span>
                    </h1>
                    <p className="text-center">
                        The classic Whot card game reborn for the digital era.
                        <br />
                        Compete, connect and earn real cash prizes — anytime,
                        <br />
                        anywhere.
                    </p>
                    <div className="flex items-center gap-5">
                        <button className="flex items-center gap-2 bg-gradient-to-tr from-[#FFB800] to-[#ff9600] p-4 rounded-lg text-[#370723] font-bold">
                            <IoPhonePortraitOutline size={24} /> Start Earning
                            Now
                        </button>
                        <button
                            onClick={() => scrollToSection("features")}
                            className="border border-white/20 bg-white/5 p-4 rounded-lg text-white font-bold"
                        >
                            Explore Features
                        </button>
                    </div>
                    <div
                        onClick={redirectToAppStore}
                        className="flex items-center gap-5 text-white z-100"
                    >
                        <button className="flex flex-col p-2 rounded-lg font-bold border border-[#FFB800]/70 px-5 bg-white/3 cursor-pointer">
                            <div className="text-xs">Download on</div>
                            <div className="text-white flex gap-2 items-center">
                                <PiAppStoreLogoBold />
                                App Store
                            </div>
                        </button>
                        <button
                            onClick={redirectToPlayStore}
                            className="flex flex-col p-2 rounded-lg font-bold border border-[#FFB800]/70 px-5 bg-white/3 cursor-pointer"
                        >
                            <div className="text-xs">Get It On</div>
                            <div className="text-white flex gap-2 items-center">
                                <IoLogoGooglePlaystore />
                                Play Store
                            </div>
                        </button>
                    </div>
                </div>
                <div className="hidden md:flex w-full">
                    <img src="assets/react/person.svg" loading="lazy" />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-30 bg-gradient-to-b from-transparent to-black/80" />
            </div>
        </>
    );
}

