import { FaNairaSign } from "react-icons/fa6";
import { IoGameControllerOutline, IoNavigateOutline } from "react-icons/io5";
import { MdOutlineSmartphone } from "react-icons/md";

export default function KeyFeatures() {
    const keyfeatures = [
        {
            Icon: <MdOutlineSmartphone />,
            topic: "User Friendly",
            desc: "Intuitive design that anyone can pick up and play instantly.",
        },
        {
            Icon: <IoGameControllerOutline />,
            topic: "Seamless Interface",
            desc: "A buttery-smooth, clutter-free gaming experience.",
        },
        {
            Icon: <IoNavigateOutline />,
            topic: "Sleek Navigation",
            desc: "Move between games and modes in a single tap.",
        },
        {
            Icon: <FaNairaSign />,
            topic: "Cash Prizes",
            desc: "Compete and win real money in skill-based matches.",
        },
    ];
    return (
        <>
            <div className="mt-10 w-full px-8">
                <div className="text-center">
                    <h2 className="text-3xl text-white font-bold">
                        Key <span className="text-[#FFB800]">Features</span>
                    </h2>
                    <p>Everything you need to play, win and have fun</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full">
                    {keyfeatures.map((features, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-2 text-center bg-[#2B061C] items-center border border-[#FFB800]/20 p-4 rounded-lg"
                        >
                            <div className="text-2xl text-[#FFB800] p-2 border border-[#FFB800]/20 p-4 rounded-lg ">
                                {features.Icon}
                            </div>
                            <h2 className="text-white font-semibold">
                                {features.topic}
                            </h2>
                            <p className="text-xs">{features.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

