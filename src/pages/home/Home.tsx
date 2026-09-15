import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import Header from "../../components/header/Header";
import Matches from "./Matches";
import Accumulator from "./Accumulator";

export default function Home() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center mt-30 ">
                <div className=" w-[95vw] lg:w-[60vw] h-[40vh] lg:h-[70vh]">
                    <div className="w-full h-full flex items-center justify-cente  rounded-lg border-2 border-[#ffa500]/90 overflow-hidden bg-[#361527]">
                        <PhaserGame ref={phaserRef} />
                    </div>
                    <Matches />
                </div>
            </div>
        </>
    );
}

