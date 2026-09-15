import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogIn } from "../../api/auth-api";
import { Toaster, toast } from "sonner";
import { useAuth } from "../../store/auth-store";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { data, error, mutate } = useMutation({
        mutationKey: ["signup_request"],
        mutationFn: (data: { email: string; password: string }) => LogIn(data),
    });
    const setLogin = useAuth((s) => s.setLoginResult);

    const handle_login = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (!isEmail(email)) {
            toast.error("invalid Email");
            return;
        }
        mutate({ email, password });
    };
    useEffect(() => {
        if (data) {
            console.log(data);
            if (data.ret > 0) {
                toast.error(data.msg);
            } else {
                toast.success(data.msg);
                setLogin(data);
                localStorage.setItem(
                    "replay_session",
                    JSON.stringify({ ...data, logTime: Date.now() }),
                );
                navigate("/");
            }
        }
        if (error) {
            toast.error(error.message);
        }
    }, [data, error]);

    return (
        <>
            <div>
                <div className="text-white/80 absolute w-full h-full flex flex-col justify-center items-center bg-[radial-gradient(circle,#47082f_0%,#2b0719_100%)]">
                    <div className="mb-3">
                        <div className="flex flex-col gap-2 items-center">
                            <img
                                src="assets/react/logo.png"
                                alt="logo"
                                className="w-[48px]"
                            />
                            <div>
                                <h1 className="font-bold text-sm">
                                    Whot Africa{" "}
                                    <span className="text-[#ffb800]">
                                        Replay
                                    </span>
                                </h1>
                            </div>
                        </div>
                        <h1 className="font-bold text-white text-2xl">
                            Login to your account
                        </h1>
                    </div>
                    <div className="bg-[#370524] w-[95%] md:w-[60%] lg:w-[30%] h-auto p-3 rounded-lg border border-[#FFB800] shadow-[0_0_30px_2px_#ffa400] flex flex-col gap-3 justify-center">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Password</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                            />
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                                handle_login(e);
                            }}
                            className="bg-[#FFB800] text-[#2E071B] rounded-lg p-2 font-bold text-lg mt-4"
                        >
                            Login
                        </motion.button>
                    </div>
                    <div className="mt-5">
                        dont have an account ?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-blue-500 cursor-pointer"
                        >
                            SIGNUP
                        </span>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" richColors />
        </>
    );
}

function isEmail(text: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

