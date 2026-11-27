import React, { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout, { NavBarStatus } from "../components/Layout";
import styles from "../style";
import { UserInfo, decryptToken } from "../service/auth";
import { CONFIG, RUN_MODE } from "../constants";
import { useSearchParams } from "react-router";
import { verify } from "crypto";
import { success, fail } from "../assets";
import { stat } from "fs";

const CryptoResult: React.FC = () => {
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    let [searchParams] = useSearchParams();

    useEffect(() => {
        const payment_status = searchParams.get("status");
        if (payment_status) {
            setStatus(payment_status);
            if (payment_status == "success") {
                setMessage("Payment was successful! 🎉");
            } else if (payment_status == "fail") {
                setMessage("Payment failed. Please try again. 😞");
            } else {
                setMessage("Unknown payment status.");
            }
        }
    }, []);

    return (
        <Layout>
            <div className={`${styles.flexCenter} bg-main-backcolor`}>
                <div className={`${styles.boxWidth}`}>
                    <div className="flex justify-center items-center p-16 space-x-6">
                        <img
                            src={status == "success" ? success : fail}
                            className="h-[36px] w-[36px]"
                        />
                        <span className="font-lexend font-normal text-[24px] text-black">
                            {message}
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CryptoResult;
