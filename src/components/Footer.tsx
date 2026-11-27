import { FC } from "react";
import styles from "../style";
import {
    facebook_icon,
    instagram_icon,
    linkedin_icon,
    twitter_icon,
    whot_coin,
    whot_footer,
} from "../assets";
import { useNavigate } from "react-router";

const Footer: FC = () => {
    const navigate = useNavigate();
    return (
        <section id="basic_info" className="w-full bg-black">
            <div
                className={`${styles.boxWidth} ${styles.flexCenter} flex-col mx-auto`}
            >
                <img
                    src={whot_footer}
                    className="w-[118px] h-[121px] mt-[116px] mb-[76px]"
                />
                <div
                    className={`flex md:flex-row flex-col-reverse justify-start items-start md:mb-32 mb-4 gap-y-12`}
                >
                    <div className="md:hidden flex justify-center w-full mt-[80px]">
                        <img src={whot_coin} className="w-[106px] h-[106px]" />
                    </div>
                    <div
                        className={`${styles.flexStart} flex-col md:w-1/3 px-[30px] space-y-[30px]`}
                    >
                        <span
                            className="font-lexend font-light text
                        -[16px] text-white"
                        >
                            WHOT is a premier interactive entertainment platform
                            for the mobile world. Our diverse collection of
                            engaging games, including the digitized Whot card
                            game, connects people globally.
                        </span>
                        <span className="font-lexend font-light text-[16px] text-white">
                            With a portfolio of over 200 entertaining titles, we
                            bring joy to players worldwide, creating memorable
                            gaming experiences that transcend borders
                        </span>
                    </div>
                    <div
                        className={`flex justify-start md:w-2/3 w-full md:space-x-0 space-x-6`}
                    >
                        <div
                            className={`flex justify-start item-start flex-col w-2/5 md:space-y-2 space-y-6 md:border-l md:border-r md:border-gray md:px-16 px-8`}
                        >
                            <div
                                className={`flex justify-start space-x-[10px]`}
                            >
                                <img src={facebook_icon} />
                                <span className="font-lexend font-light text-[18px] text-white">
                                    Facebook
                                </span>
                            </div>
                            <div
                                className={`flex justify-start space-x-[10px]`}
                            >
                                <img src={instagram_icon} />
                                <span className="font-lexend font-light text-[18px] text-white">
                                    Instagram
                                </span>
                            </div>
                            <div
                                className={`flex justify-start space-x-[10px]`}
                            >
                                <img src={linkedin_icon} />
                                <span className="font-lexend font-light text-[18px] text-white">
                                    LinkedIn
                                </span>
                            </div>
                            <div
                                className={`flex justify-start space-x-[10px]`}
                            >
                                <img src={twitter_icon} />
                                <span className="font-lexend font-light text-[18px] text-white">
                                    Twitter
                                </span>
                            </div>
                        </div>

                        <div className={`flex justify-start items-start w-3/5`}>
                            <div className="flex flex-col justify-start items-start md:space-y-2 space-y-6 md:px-16 px-8">
                                <span className="font-lexend font-light text-[18px] text-white">
                                    Services
                                </span>
                                <span className="font-lexend font-light text-[18px] text-white">
                                    About us
                                </span>
                                <span className="font-lexend font-light text-[18px] text-white">
                                    Basic Info
                                </span>
                            </div>

                            <img
                                src={whot_coin}
                                className="md:block hidden ml-[32px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Footer;
