import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SignUp } from "../../api/auth-api";
import { toast, Toaster } from "sonner";
import CountryList from "../../components/info/country-list";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { ImAppleinc } from "react-icons/im";

export default function Register() {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");
    const [isCountryOpen, setIsCountryOpen] = useState(false);

    const { data, error, mutate } = useMutation({
        mutationKey: ["signup_request"],
        mutationFn: (data: {
            full_name: string;
            email: string;
            password: string;
            country: string;
        }) => SignUp(data),
    });

    const handle_signup = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();

        if (fullname.length < 3) {
            toast.error("Name must be more than 2 characters");
            return;
        }

        if (!isEmail(email)) {
            toast.error("Invalid Email");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be more than 8 characters");
            return;
        }

        mutate({
            full_name: fullname,
            email,
            password,
            country,
        });
    };

    useEffect(() => {
        if (data) {
            console.log(data);

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Sign up successful, Login to your account");
                navigate("/login");
            }
        }

        if (error) {
            console.log(error);

            if (error.message.includes("409")) {
                toast.error("EMAIL ALREADY EXISTS");
                return;
            }

            if (error.message.includes("400")) {
                toast.error("MISSING FIELD");
                return;
            }

            toast.error(error.message);
        }
    }, [data, error]);

    return (
        <>
            {/* Full screen container */}
            <div
                className="min-h-screen w-full flex flex-col items-center justify-center text-white/80"
                onClick={() => setIsCountryOpen(false)}
            >
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
                        Create an account
                    </h1>
                </div>

                {/* Register card */}
                <div
                    style={{ backgroundColor: "rgba(55, 5, 36, 0.6)" }}
                    className=" w-[95%] md:w-[60%] lg:w-[30%] h-auto p-3 rounded-lg border border-[#FFB800] shadow-[0_0_30px_2px_#ffa400] flex flex-col gap-1 justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Google / Apple */}
                    <div className="w-full">
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // SignInWithGoogle();
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
                                // SigninWithapple();
                            }}
                            className="bg-[#34A1EB] w-full text-white rounded-lg p-2 font-bold text-lg mt-4 flex items-center justify-center gap-3"
                        >
                            <ImAppleinc />
                            Continue With Apple
                        </motion.button>
                    </div>

                    {/* Fullname */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Fullname</label>

                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full p-1 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-1 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Country</label>

                        <div className="relative w-1/2">
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setIsCountryOpen(true);
                                }}
                                onFocus={() => setIsCountryOpen(true)}
                                className="w-full p-1 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                            />

                            {isCountryOpen && (
                                <CountryList
                                    search={country}
                                    onSelect={(selectedCountry) => {
                                        setCountry(selectedCountry);
                                        setIsCountryOpen(false);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-1 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                        />
                    </div>

                    {/* Signup button */}
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={handle_signup}
                        className="bg-[#FFB800] text-[#2E071B] rounded-lg p-2 font-bold text-lg mt-4"
                    >
                        Signup
                    </motion.button>
                </div>

                {/* Login */}
                <div className="mt-5">
                    already have an account ?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-500 cursor-pointer"
                    >
                        LOGIN
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

