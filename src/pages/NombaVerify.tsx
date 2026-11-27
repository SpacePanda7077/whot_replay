import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import styles from "../style";
import { CONFIG, RUN_MODE } from "../constants";
import { useSearchParams } from "react-router";
import { success, fail } from "../assets";

const NombaVerify: React.FC = () => {
    const [verifyState, setVerifyState] = useState(-1);
    const [message, setMessage] = useState("");
    let [searchParams] = useSearchParams();

    useEffect(() => {
        handleVerify();
    }, []);

    const handleVerify = async () => {
        const orderReference = searchParams.get("orderReference");
        if (orderReference == null) return;

        const params = {
            orderReference,
        };
        const response = await fetch(
            `${CONFIG[RUN_MODE].BACKEND_URL}/nomba/verify`,
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

export default NombaVerify;

