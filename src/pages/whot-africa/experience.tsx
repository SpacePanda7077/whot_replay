export default function Experience() {
    return (
        <>
            <div className="mt-10 flex items-center w-full">
                <div className="relative hidden lg:flex w-full pl-10">
                    <img
                        src="assets/react/phone.svg"
                        className="max-w-70 relative z-20"
                    />
                    <div className="absolute left-50 bottom-0">
                        <img
                            src="assets/react/card.svg"
                            className="max-w-70 -z-200"
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="text-center text-4xl text-white font-bold">
                        <h1>Immerse Yourself in a</h1>
                        <h1>
                            {" "}
                            <span className="text-[#FFB800]">
                                Modern Gaming
                            </span>{" "}
                            Experience
                        </h1>
                    </div>
                    <p className="text-xs text-center">
                        Over 200 entertaining titles, a digitized Whot card
                        game, and a global community
                        <br /> — all in the palm of your hand.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4 justify-between items-center">
                        <div className="flex flex-col justify-center items-center gap-1">
                            <img
                                src="assets/react/cash.svg"
                                className="w-[96px]"
                            />
                            <p className="text-white text-sm">
                                Offline & Online Modes
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                            <img
                                src="assets/react/trophy.svg"
                                className="w-[96px]"
                            />
                            <p className="text-white text-sm">
                                User-Friendly Controls
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                            <img
                                src="assets/react/medal.svg"
                                className="w-[96px]"
                            />
                            <p className="text-white text-sm">
                                Classic & Digital Fusion
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                            <img
                                src="assets/react/connect_with_friends.png"
                                className="w-[96px]"
                            />
                            <p className="text-white text-sm">
                                Connect With Friends
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

