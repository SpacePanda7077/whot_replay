import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogIn, SigninWithapple, SignInWithGoogle } from "../../api/auth-api";
import { Toaster, toast } from "sonner";
import { useAuth } from "../../store/auth-store";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { ImAppleinc } from "react-icons/im";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { data, error, mutate } = useMutation({
        mutationKey: ["login_request"],
        mutationFn: (data: { email: string; password: string }) => LogIn(data),
    });

    const setLogin = useAuth((s) => s.setLoginResult);

    const handle_login = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();

        if (!isEmail(email)) {
            toast.error("Invalid Email");
            return;
        }

        if (!password) {
            toast.error("Please enter your password");
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
                    JSON.stringify({
                        ...data,
                        logTime: Date.now(),
                    }),
                );

                navigate("/");
            }
        }

        if (error) {
            toast.error(error.message);
        }
    }, [data, error, navigate, setLogin]);

    return (
        <>
            {/* Full screen container */}
            <div className="min-h-screen w-full flex flex-col items-center justify-center text-white/80">
                {/* Logo + title */}
                <div className="mb-3 text-center">
                    <div className="flex flex-col gap-2 items-center">
                        <img
                            src="assets/react/logo.png"
                            alt="logo"
                            className="w-[48px]"
                        />

                        <h1 className="font-bold text-sm">
                            Whot Africa{" "}
                            <span className="text-[#ffb800]">Replay</span>
                        </h1>
                    </div>

                    <h1 className="font-bold text-white text-2xl mt-2">
                        Login to your account
                    </h1>
                </div>

                {/* Login card */}
                <div
                    style={{ backgroundColor: "rgba(55, 5, 36, 0.6)" }}
                    className=" w-[95%] md:w-[60%] lg:w-[30%] h-auto p-3 rounded-lg border border-[#FFB800] shadow-[0_0_30px_2px_#ffa400] flex flex-col gap-3 justify-center"
                >
                    {/* Google / Apple */}
                    <div className="w-full">
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                SignInWithGoogle();
                            }}
                            className="bg-gray-100 w-full text-[#2E071B] rounded-lg p-2 font-bold text-lg mt-4 flex items-center justify-center gap-3"
                        >
                            <FcGoogle />
                            Continue With Google
                        </motion.button>

                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                SigninWithapple();
                            }}
                            className="bg-[#34A1EB] w-full text-white rounded-lg p-2 font-bold text-lg mt-4 flex items-center justify-center gap-3"
                        >
                            <ImAppleinc />
                            Continue With Apple
                        </motion.button>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                        />
                    </div>

                    {/* Login button */}
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={handle_login}
                        className="bg-[#FFB800] text-[#2E071B] rounded-lg p-2 font-bold text-lg mt-4"
                    >
                        Login
                    </motion.button>
                </div>

                {/* Signup */}
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

            <Toaster position="top-right" richColors />
        </>
    );
}

function isEmail(text: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

