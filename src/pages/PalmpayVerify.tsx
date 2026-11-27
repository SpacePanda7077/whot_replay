import React, { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout, { NavBarStatus } from "../components/Layout";
import styles from "../style";
import { UserInfo, decryptToken } from "../service/auth";
import { CONFIG, RUN_MODE } from "../constants";
import { useSearchParams } from "react-router";
import { verify } from "crypto";
import { success, fail } from "../assets";

const PalmpayVerify: React.FC = () => {
    const navigate = useNavigate();
    const [verifyState, setVerifyState] = useState(-1);
    const [message, setMessage] = useState("");

    let [searchParams] = useSearchParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        handleVeryfy();
    }, []);

    const handleVeryfy = async () => {
        console.log("handleVeryfy");
        const token = localStorage.getItem("token");

        let orderId = searchParams.get("orderId");
        if (orderId == null) return;

        const params = {
            orderId: orderId,
        };
        const response = await fetch(
            `${CONFIG[RUN_MODE].BACKEND_URL}/palmpay/verify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            },
        );

        const responseData = await response.json();
        setVerifyState(responseData.ret);
        setMessage(responseData.msg);
    };

    return (
        <Layout>
            <div className={`${styles.flexCenter} bg-main-backcolor`}>
                <div className={`${styles.boxWidth}`}>
                    {verifyState == -1 ? (
                        <div className="flex justify-center items-center p-16">
                            <span className="font-lexend font-normal text-[24px] text-black">
                                Payment is being verified...
                            </span>
                        </div>
                    ) : verifyState == 0 ? (
                        <div className="flex justify-center items-center p-16 space-x-6">
                            <img src={success} className="h-[36px] w-[36px]" />
                            <span className="font-lexend font-normal text-[24px] text-black">
                                {message}
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center p-16 space-x-6">
                            <img src={fail} className="h-[36px] w-[36px]" />
                            <span className="font-lexend font-normal text-[24px] text-black">
                                {message}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PalmpayVerify;

