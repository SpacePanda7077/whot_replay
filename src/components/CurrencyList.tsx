import { useState, useEffect } from "react";
import { CONFIG, RUN_MODE } from "../constants";
import Layout from "./Layout";
import styles from "../style";

export interface Currency {
    code: string; // e.g., "NGN", "USDT"
    name: string; // e.g., "Naira", "USDT"
    deposit_rate: number; // Conversion rate for the coin (e.g., 1.00, 0.64)
    deposit_extra_rate: number;

    withdraw_rate: number;
    withdraw_extra_rate: number;
}

interface DepositBonusSettings {
    minimum_amount: number;
    percentage: number;
    first_deposit_percentage: number;
}

//export interface Handlers

const CurrencyList = ({
    onSelectCurrency,
}: {
    onSelectCurrency: (currency: Currency) => void;
}) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [bonus, setBonus] = useState<DepositBonusSettings | null>(null);

    useEffect(() => {
        const loadCurrencies = async () => {
            const response = await fetchCurrencyList();
            setCurrencies(response.data);
            setBonus(response.bonus);
        };

        loadCurrencies();
    }, []);

    const fetchCurrencyList = async (): Promise<{
        data: Currency[];
        bonus: DepositBonusSettings | null;
    }> => {
        try {
            const response: Response = await fetch(
                `${CONFIG[RUN_MODE].BACKEND_URL}/deposits/currencies`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const responseData = await response.json();
            return {
                data: responseData.data || [],
                bonus: responseData.bonus || null,
            };
        } catch (error) {
            console.error("Error fetching currency list", error);
            return { data: [], bonus: null };
        }
    };

    return (
        <Layout>
            <div className={`${styles.flexCenter} bg-main-backcolor`}>
                <div className={`w-full max-w-[500px]`}>
                    <h1 className="font-lexend font-medium text-[52px] text-black text-center mb-[12px] mt-[12px]">
                        Currency
                    </h1>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {bonus &&
                            bonus.percentage > 0 &&
                            bonus.minimum_amount > 0 && (
                                <div className="flex items-center justify-center gap-2 border-b border-gray-100 pb-5 text-sm">
                                    <span className="font-lexend font-semibold text-[#8d0c59]">
                                        {bonus.percentage}% bonus
                                    </span>
                                    <span className="text-gray-600">
                                        on deposits of{" "}
                                        <strong>
                                            ₦
                                            {bonus.minimum_amount.toLocaleString()}{" "}
                                            and above
                                        </strong>
                                    </span>
                                </div>
                            )}
                        {currencies.map((currency) => (
                            <div
                                className="flex flex-rows justify-between mt-5 items-center hover:bg-gray p-2 shadow-md"
                                key={currency.code}
                                onClick={() => onSelectCurrency(currency)}
                            >
                                <div className="flex flex-rows justify-start space-x-5 items-center">
                                    <img
                                        src={`${CONFIG[RUN_MODE].BACKEND_URL}/deposits/currency/${currency.code}.png`}
                                        alt={currency.name}
                                        width={40}
                                    />
                                    <span>
                                        {currency.code} - {currency.name}
                                    </span>
                                </div>

                                <span>
                                    {currency.deposit_rate +
                                        currency.deposit_extra_rate}{" "}
                                    coin
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CurrencyList;

