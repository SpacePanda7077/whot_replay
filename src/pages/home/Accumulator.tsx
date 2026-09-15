import { ImStack } from "react-icons/im";
import Accumulator_Public from "./Accumulator_Public";
import Accumulator_Private from "./Accumulator_Private";
import { useState } from "react";

export default function Accumulator() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="fixed bottom-0 left-0 w-full p-2 text-white/40 bg-[#30031f] border border-[#ffa400]/60 rounded-t-2xl">
                <Accumulator_Public setIsOpen={setIsOpen} />
                {isOpen && <Accumulator_Private />}
            </div>
        </>
    );
}

