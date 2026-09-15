import { useNavigate } from "react-router";

export default function NotLoggedIn() {
    const navigate = useNavigate();
    return (
        <>
            <div className="absolute bg-black/40 rounded-lg backdrop-blur-lg w-full h-full flex flex-col gap-4 justify-center font-bold text-white text-2xl items-center">
                LOG IN TO PLAY
                <button
                    onClick={() => navigate("/login")}
                    className="bg-[#ffb800] rounded-lg p-2 text-[#2e071b]"
                >
                    LOGIN
                </button>
            </div>
        </>
    );
}

