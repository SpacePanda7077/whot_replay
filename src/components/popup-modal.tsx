import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

interface Prop {
    text: string;
    type: "SUCCESS" | "ERROR";
    setShow: (value: boolean) => void;
}

export default function PopUpModal({ text, type, setShow }: Prop) {
    return (
        <>
            <div className="z-50 mt-10 fixed top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center  backdrop-blur-lg shadow-black shadow-lg">
                <div className="aspect-4/4 flex flex-col justify-center items-center gap-6 bg-[#370723] border border-[#FFB800]/20 rounded-lg h-auto p-10 w-[95vw] md:w-[60vw] lg:w-[35vw]">
                    {type === "SUCCESS" && (
                        <FaCheck size={128} color="#7FBF18" />
                    )}
                    {type === "ERROR" && (
                        <FcCancel size={128} color="#bf1818" />
                    )}
                    <p className="text-white text-xl md:text-2xl font-bold text-center">
                        {text}
                    </p>

                    <button
                        onClick={() => setShow(false)}
                        className="shadow-[0_0_10px_2px_#e53603] w-1/2 bg-[#e53603] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#e53603]/80"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

