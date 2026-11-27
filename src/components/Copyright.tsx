import { FC } from "react";
import styles from "../style";
import { useNavigate } from "react-router";

const Copyright: FC = () => {
    const navigate = useNavigate();
    const handleTermsClick = (event: any) => {
        navigate("/terms");
    };

    const handlePrivacyPolicyClick = (event: any) => {
        navigate("/privacy-policy");
    };
    return (
        <section className="w-full bg-gray">
            <div
                className={`${styles.boxWidth} ${styles.flexCenter} flex-col mx-auto`}
            >
                <div className="flex flex-col items-center text-center md:w-[970px] w-full p-12 md:mb-0 mb-32">
                    <span className="font-lexend font-light text-black md:text-[16px] text-[12px]">
                        © 2024 WHOT Africa. All Rights Reserved. WHOT Africa and
                        the WHOT Africa logo are trademarks of WHOT Studios. Any
                        unauthorized use, reproduction, or distribution is
                        strictly prohibited.{" "}
                        <a onClick={handleTermsClick} className="text-blue-500">
                            Terms of Service
                        </a>{" "}
                        |{" "}
                        <a
                            onClick={handlePrivacyPolicyClick}
                            className="text-blue-500"
                        >
                            Privacy Policy
                        </a>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Copyright;
