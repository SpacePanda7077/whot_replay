import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import styles from "../style";
import { CONFIG, RUN_MODE } from "../constants";
import { useSearchParams } from "react-router";
import { success, fail } from "../assets";

const OpayResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState(
        "Your OPay payment is being confirmed.",
    );

    useEffect(() => {
        const reference = searchParams.get("reference");
        if (!reference) {
            setStatus("failed");
            setMessage("Payment reference is missing.");
            return;
        }

        let timer: ReturnType<typeof setTimeout>;
        const checkStatus = async () => {
            try {
                const response = await fetch(
                    `${CONFIG[RUN_MODE].BACKEND_URL}/opay/status`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ reference }),
                    },
                );
                const responseData = await response.json();
                setStatus(responseData.status);
                setMessage(responseData.msg);

                if (responseData.status === "pending") {
                    timer = setTimeout(checkStatus, 2000);
                }
            } catch {
                setStatus("failed");
                setMessage(
                    "Unable to confirm your payment. Please check your deposit history.",
                );
            }
        };

        checkStatus();
        return () => clearTimeout(timer);
    }, [searchParams]);

    return (
        <Layout>
            <div className={`${styles.flexCenter} bg-main-backcolor`}>
                <div className={`${styles.boxWidth}`}>
                    <div className="flex justify-center items-center p-16 space-x-6">
                        {status !== "pending" && (
                            <img
                                src={status === "success" ? success : fail}
                                className="h-[36px] w-[36px]"
                            />
                        )}
                        <span className="font-lexend font-normal text-[24px] text-black">
                            {message}
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OpayResult;

