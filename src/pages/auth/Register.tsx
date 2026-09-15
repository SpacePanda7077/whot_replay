import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SignUp } from "../../api/auth-api";
import { toast, Toaster } from "sonner";
import CountryList from "../../components/info/country-list";

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
            toast.error("name must be more than 2 characters");
            return;
        }
        if (!isEmail(email)) {
            toast.error("invalid Email");
            return;
        }
        if (password.length < 8) {
            toast.error("password must be more than 8 characters");
            return;
        }

        mutate({ full_name: fullname, email, password, country });
    };

    useEffect(() => {
        if (data) {
            console.log(data);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Sign up successfull");
            }
        }
        if (error) {
            console.log(error);
            if (error.message.includes("409")) {
                toast.error("EMAIL ALREADY EXISTS");
                return;
            }
            if (error.message.includes("400")) {
                toast.error("MISSING FEILD");
                return;
            }

            toast.error(error.message);
        }
    }, [data, error]);
    return (
        <>
            <div onClick={() => setIsCountryOpen(false)}>
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
                            Create an account
                        </h1>
                    </div>
                    <div className="bg-[#370524] w-[95%] md:w-[60%] lg:w-[30%] h-auto p-3 rounded-lg border border-[#FFB800] shadow-[0_0_30px_2px_#ffa400] flex flex-col gap-3 justify-center">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Fullname</label>
                            <input
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                            />
                        </div>
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
                            <label className="font-bold">Country</label>
                            <div className="relative w-1/2">
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => {
                                        setCountry(e.target.value);
                                        setIsCountryOpen(true);
                                    }}
                                    className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                                />{" "}
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
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-white/60 rounded-lg focus:border-[#FFB800] focus:outline-none bg-[#2E071B]"
                            />
                        </div>

                        <button
                            onClick={(e) => {
                                handle_signup(e);
                            }}
                            className="bg-[#FFB800] text-[#2E071B] rounded-lg p-2 font-bold text-lg mt-4"
                        >
                            Signup
                        </button>
                    </div>
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
            </div>
            <Toaster position="top-right" richColors />
        </>
    );
}
function isEmail(text: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

