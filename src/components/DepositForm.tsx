import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Layout, { NavBarStatus } from "../components/Layout";
import styles from "../style";
import { UserInfo, decryptToken } from "../service/auth";
import {
    CONFIG,
    CURRENCY_KSH,
    CURRENCY_NGN,
    RUN_MODE,
    CRYPTO_ERC20_USDT,
    CRYPTO_TRC20_USDT,
    USDTERC20_CODE,
    NGN_CODE,
    KSH_CODE,
} from "../constants";
import { Currency } from "./CurrencyList";

const DepositForm = ({
    currency,
    handleBack,
}: {
    currency: Currency;
    handleBack: () => void;
}) => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const [userId, setUserId] = useState("");
    const [emailaddress, setEmailAddress] = useState("");
    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [gateway, setGateway] = useState("");
    const [isCurrencyDisabled, setIsCurrencyDisabled] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        //if(token == null || token == "")
        //    navigate("/login", {state:{prevPage:"/deposit"}});
        if (token) {
            const userInfo: UserInfo = decryptToken(token);
            setUserId(userInfo.id);
            setUsername(userInfo.name);
            setEmailAddress(userInfo.email);
        }

        const param_email = searchParams.get("email");
        console.log("email", param_email);
        if (param_email) setEmailAddress(param_email);
        const param_username = searchParams.get("username");
        if (param_username) setUsername(param_username);

        const param_amount = searchParams.get("amount");
        if (param_amount) {
            setAmount(+param_amount);
        }

        if (currency.code.includes("USDT")) {
            console.log("currency code", currency.code);
            setGateway("crypto");
        }
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Deposit handleSubmit");

        if (gateway === "") {
            setMessage("Select preferred payment option");
            return;
        }

        if (emailaddress == "") return;

        const params = {
            email: emailaddress,
            amount,
            currency:
                currency.code == NGN_CODE
                    ? CURRENCY_NGN
                    : currency.code == KSH_CODE
                      ? CURRENCY_KSH
                      : currency.code == USDTERC20_CODE
                        ? CRYPTO_ERC20_USDT
                        : CRYPTO_TRC20_USDT,
        };
        const token = localStorage.getItem("token");
        let url = "";

        console.log("gateway", gateway);
        switch (gateway) {
            case "opay":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/opay/deposit`;
                break;
            case "paystack":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/deposit`;
                break;
            // case 'marasoftpay':
            //     url = `${CONFIG[RUN_MODE].BACKEND_URL}/marasoftpay/deposit`;
            //     break;
            case "credo":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/credo/deposit`;
                break;
            case "payaza":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/payaza/deposit`;
                break;
            case "crypto":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/crypto/deposit`;
                break;
            case "palmpay":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/palmpay/deposit`;
                break;
            case "nomba":
                url = `${CONFIG[RUN_MODE].BACKEND_URL}/nomba/deposit`;
                break;
        }
        const response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Whot ${token}`,
            },
            body: JSON.stringify(params),
        });

        const responseData = await response.json();
        console.log("Deposit response", responseData);
        if (responseData.ret == 2) {
            localStorage.setItem("token", "");
            navigate("/login", { state: { prevPage: "/deposit" } });
            return;
        } else if (responseData.ret == 3) {
            console.log("response eror:", responseData.msg);
            setMessage(responseData.msg);
            return;
        }

        if (responseData.ret !== 0 || !responseData.url) {
            setMessage(responseData.msg || "Unable to start payment");
            return;
        }

        window.location.href = responseData.url;
    };

    const handleGateway = (event: any) => {
        const nextGateway = event.target.value;
        setGateway(nextGateway);
        setMessage("");

        const disabled: boolean =
            nextGateway === "opay" ||
            nextGateway === "paystack" ||
            nextGateway === "credo" ||
            nextGateway === "nomba";
        setIsCurrencyDisabled(disabled);
    };

    return (
        <Layout>
            <div className={`${styles.flexCenter} bg-main-backcolor`}>
                <div className={`w-full max-w-[500px]`}>
                    <h1 className="font-lexend font-medium text-[52px] text-black text-center mb-[12px] mt-[12px]">
                        Deposit
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    >
                        <div className="mb-4">
                            <label
                                className="font-lexend font-normal block text-black text-sm font-bold mb-2"
                                htmlFor="username"
                            >
                                Email address
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="Email address"
                                type="text"
                                placeholder="adanbarnett114@gmail.com"
                                value={emailaddress}
                                onChange={(e) =>
                                    setEmailAddress(e.target.value)
                                }
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="font-lexend font-normal block text-black text-sm font-bold mb-2"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="Name"
                                type="text"
                                placeholder="Player"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <div className="flex flex-rows justify-between items-center">
                                <label
                                    className="font-lexend font-normal block text-black text-sm font-bold mb-2"
                                    htmlFor="amount"
                                >
                                    COIN
                                </label>

                                <label
                                    className="font-lexend font-normal block text-black text-sm font-bold mb-2"
                                    htmlFor="amount"
                                >
                                    <span className="text-red-500 mr-2">{`(1 ${currency.code} = ${currency.deposit_rate + currency.deposit_extra_rate} COIN)`}</span>
                                    <br />
                                    <span className="text-blue-500 font-bold">{`You will pay ${(amount / (currency.deposit_rate + currency.deposit_extra_rate)).toFixed(2)} ${currency.code}`}</span>
                                </label>
                            </div>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="Name"
                                type="text"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => {
                                    var t = parseInt(e.target.value, 10);
                                    t = isNaN(t) ? 0 : t;
                                    setAmount(t);
                                }}
                            />
                        </div>

                        {gateway === "crypto" && (
                            <span className="font-lexend font-normal block text-black text-sm font-bold mb-5">
                                Make sure to send the exact USDT amount and use
                                the correct network. Incorrect deposits can’t be
                                recovered, so double-check before sending!
                            </span>
                        )}

                        {gateway !== "crypto" && (
                            <div>
                                <div className="mb-4">
                                    <label
                                        className="font-lexend font-normal block text-black text-sm font-bold mb-2"
                                        htmlFor="gateway"
                                    >
                                        Select Payment Option Below
                                    </label>

                                    <select
                                        id="gateway"
                                        name="gateway"
                                        onChange={handleGateway}
                                        className={`max-w-lg pl-2 shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border 'border-gray-300' rounded-md`}
                                        value={gateway}
                                    >
                                        <option key="select" value="">
                                            Select
                                        </option>
                                        <option key="opay" value="opay">
                                            OPay
                                        </option>
                                        <option key="paystack" value="paystack">
                                            Paystack
                                        </option>
                                        <option key="nomba" value="nomba">
                                            Nomba
                                        </option>
                                        <option key="palmpay" value="palmpay">
                                            PalmPay
                                        </option>
                                        <option key="credo" value="credo">
                                            Credo
                                        </option>
                                        {/* <option key="marasoftpay" value="marasoftpay">Whot pay</option> */}
                                    </select>
                                </div>

                                <span className="font-lexend font-normal block text-black text-sm font-bold mb-5">
                                    The Bank transfer payment method for virtual
                                    banks may fail, we recommend you preferably
                                    use conventional banks for this method.
                                </span>
                            </div>
                        )}

                        {/* {gateway === 'crypto' && walletAddress && (
                            <div className="mb-4 flex items-center space-x-4">
                                <div className="flex-1">
                                    <label className="font-lexend font-normal block text-black text-sm font-bold mb-2">
                                        Wallet Address
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        readOnly
                                        value={walletAddress}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(walletAddress);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    title="Copy wallet address"
                                >
                                    Copy
                                </button>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <svg
                                        className="animate-spin h-5 w-5 text-gray-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    <span>{countdown}</span>
                                </div>

                                {isPaid && <div className="text-green-600 font-bold ml-4">Payment received ✅</div>}
                                {hasExpired && !isPaid && <div className="text-red-600 font-bold ml-4">Payment expired ❌</div>}
                            </div>
                        )} */}

                        {message == "" ? (
                            <></>
                        ) : (
                            <span className="font-lexend font-normal block text-blood text-sm mb-5">
                                {message}
                            </span>
                        )}
                        <div className="flex items-center justify-between space-x-[30px]">
                            <button
                                className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                            <button
                                className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default DepositForm;

