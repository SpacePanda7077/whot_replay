import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { useNavigate } from "react-router";

export default function About() {
    const navigate = useNavigate();

    const redirectTo = (link: string) => {
        window.location.href = link;
    };
    return (
        <>
            <div className=" flex flex-col text-center gap-7 items-center justify-center w-full  ">
                <div className="border border-[#FFB800]/20 w-[100%] flex flex-col lg:flex-row text-start gap-7 py-4 px-10 rounded-lg bg-[url('/assets/footer.png')] bg-cover">
                    <div className="w-[100%] flex items-center gap-5">
                        <div className="flex gap-2 hidden lg:block items-center">
                            <img
                                src="assets/react/logo.png"
                                alt="logo"
                                className="w-[64px]"
                            />
                        </div>
                        <div>
                            <h1 className="text-white text-3xl font-bold text-center lg:text-start ">
                                About Whot Africa
                            </h1>
                            <p className="text-xs text-center lg:text-start">
                                WHOT is a premier interactive entertainment
                                platform for the mobile world. Our diverse
                                collection of
                                <br /> engaging games, including the digitized
                                Whot card game, connects people globally. With a
                                portfolio of over
                                <br /> 200 entertaining titles, we bring joy to
                                players worldwide — creating memorable gaming
                                experiences that
                                <br />
                                transcend borders.
                            </p>
                        </div>
                    </div>
                    <div className="w-[100%] lg:w-[25%] flex flex-col gap-4">
                        <div className="flex justify-center gap-4 text-white">
                            <div
                                onClick={() =>
                                    redirectTo(
                                        "https://www.facebook.com/whotafrica1/",
                                    )
                                }
                                className="flex cursor-pointer gap-2 items-center hover:text-[#ffb800]"
                            >
                                <FaFacebookSquare size={28} /> Facebook
                            </div>
                            <div
                                onClick={() =>
                                    redirectTo(
                                        "https://www.instagram.com/whotafrica/",
                                    )
                                }
                                className="flex cursor-pointer gap-2 items-center hover:text-[#ffb800]"
                            >
                                <RiInstagramFill size={28} /> Instagram
                            </div>
                            <div
                                onClick={() =>
                                    redirectTo(
                                        "https://ng.linkedin.com/company/whotafrica-digital",
                                    )
                                }
                                className="flex cursor-pointer gap-2 items-center hover:text-[#ffb800]"
                            >
                                <FaLinkedin size={28} /> LinkedIn
                            </div>
                            <div
                                onClick={() =>
                                    redirectTo("https://x.com/WhotAfrica")
                                }
                                className="flex cursor-pointer gap-2 items-center hover:text-[#ffb800]"
                            >
                                <FaSquareXTwitter size={28} /> Twitter
                            </div>
                        </div>
                        <p className="text-white text-center lg:text-start text-xs">
                            © 2024 WHOT Africa. All Rights Reserved. WHOT Africa
                            and the WHOT Africa logo are trademarks of WHOT
                            Studios.
                            <br /> Any unauthorized use, reproduction, or
                            distribution is strictly prohibited.{" "}
                            <span
                                onClick={() => navigate("/terms")}
                                className="text-[#3B82F6] cursor-pointer"
                            >
                                Terms of Service
                            </span>{" "}
                            |{" "}
                            <span
                                onClick={() => navigate("/privacy-policy")}
                                className="text-[#3B82F6] cursor-pointer"
                            >
                                Privacy Policy
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

