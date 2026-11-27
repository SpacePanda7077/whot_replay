import React, { useEffect } from "react";
import Layout from "../components/Layout";
import styles from "../style";

const MarasoftPayResult: React.FC = () => {
    useEffect(() => {
    }, []);

    return (
        <Layout>
            <div className={`${styles.flexCenter} bg-main-backcolor`}>
                <div className={`${styles.boxWidth}`}>
                    <div className="flex justify-center items-center p-16">
                        <span className="font-lexend font-normal text-[24px] text-black">
                            Payment has been done.
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MarasoftPayResult;