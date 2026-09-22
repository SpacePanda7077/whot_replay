import { useCallback, useEffect, useState } from "react";
import BankList from "./BankList";
import { useAuth } from "../../store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { SetWallet, Withdraw } from "../../api/wallet-api";
import PopUpModal from "../../components/popup-modal";
import { useWalletStore } from "../../store/wallet-store";

interface Prop {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WithdrawalModal({ setOpen }: Prop) {
    const [accountName, setAccountName] = useState<string>();
    const [accountNumber, setAccountNumber] = useState<string>();
    const [amount, setAmount] = useState<number>();
    const [bankSelectionOpen, setBankSelectionOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState("Select Bank");
    const wallet = useWalletStore((s) => s.wallet);

    const logs = useAuth((s) => s.login_result);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");

    const { mutate: withdraw } = useMutation({
        mutationKey: ["deposit_funds"],
        mutationFn: (data: { token: string; data: { amount: number } }) =>
            Withdraw(data.token, data.data),
        onSuccess: (data) => {
            // If your API function returns the response object containing status
            if (data?.status === 200 || data?.status === 201) {
                setMsg("DEPOSIT SUCCESSFULLY");
                setStatus("SUCCESS");
                setShow(true);
            }
            console.log(data);
        },
        onError: (err: any) => {
            console.error(err);

            // Extract status from Axios error or custom thrown error
            const statusCode = err.response?.status || err.status;

            if (statusCode === 400) {
                setMsg("INVALID AMOUNT");
            } else if (statusCode === 502) {
                setMsg("WITHDRAWAL REJECTED");
            } else if (statusCode === 503) {
                setMsg("WITHDRAWAL NOT CONFIGURED");
            } else {
                setMsg("ERROR WHILE DEPOSITING");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });

    const { mutate: set_account } = useMutation({
        mutationKey: ["deposit_funds"],
        mutationFn: (data: {
            token: string;
            data: {
                account_name: string;
                bank_name: string;
                account_number: string;
            };
        }) => SetWallet(data.token, data.data),
        onSuccess: (data) => {
            // If your API function returns the response object containing status
            if (data?.status === 200 || data?.status === 201) {
                setMsg("ACCOUNT SET SUCCESSFULLY");
                setStatus("SUCCESS");
                setShow(true);
            }
            console.log(data);
        },
        onError: (err: any) => {
            console.error(err);

            // Extract status from Axios error or custom thrown error
            const statusCode = err.response?.status || err.status;

            if (statusCode === 400) {
                setMsg("MISSING FEILD");
            } else if (statusCode === 500) {
                setMsg("SET ACCOUNT REJECTED");
            } else {
                setMsg("ERROR WHILE SETTING ACCOUNT");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });

    // 💡 You can now delete the entire useEffect hook!

    const handleWithdraw = useCallback(() => {
        if (!logs || !amount || amount <= 0) return;
        withdraw({
            token: logs.token,
            data: { amount: amount },
        });
    }, [logs, amount]);

    const handleSetAccount = useCallback(() => {
        if (!logs || !accountName || !accountNumber || !selectedBank) return;
        console.log("Setting account ...");
        set_account({
            token: logs.token,
            data: {
                account_name: accountName,
                account_number: accountNumber,
                bank_name: selectedBank,
            },
        });
    }, [logs, accountName, accountNumber, selectedBank]);

    useEffect(() => {
        if (wallet) {
            setAccountName(wallet.withdrawal_account.account_name);
            setAccountNumber(wallet.withdrawal_account.account_number);
            setSelectedBank(wallet.withdrawal_account.bank_name);
        }
    }, [wallet]);
    return (
        <>
            <div className="z-50 mt-10 fixed top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center  backdrop-blur-lg">
                <div className="flex flex-col gap-6 bg-[#370723] border border-[#FFB800]/20 rounded-lg w-[50vw] h-auto p-4 w-[95vw] md:w-[70vw] lg:w-[50vw]">
                    <h2 className="text-white text-md font-bold">
                        Withdraw Funds
                    </h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label>Account Name</label>
                            <input
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                className="bg-white/5 w-full p-2 rounded text-white font-bold placeholder:text-white/40"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Account Number</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) =>
                                    setAccountNumber(e.target.value)
                                }
                                className="bg-white/5 w-full p-2 rounded text-white font-bold placeholder:text-white/40"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Bank Name</label>
                            <div
                                onClick={() =>
                                    setBankSelectionOpen((prev) => !prev)
                                }
                                className="relative bg-white/5 w-1/2 h-10 p-2 rounded text-white font-bold placeholder:text-white/40"
                            >
                                {selectedBank}
                                {bankSelectionOpen && (
                                    <BankList setSelected={setSelectedBank} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex gap-2 items-center">
                            ₦{" "}
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(Number(e.target.value))
                                }
                                className="bg-white/5 w-full p-2 rounded text-white font-bold placeholder:text-white/40"
                            />
                        </div>
                        <div className="w-full flex gap-4 ">
                            <button
                                onClick={() => setOpen(false)}
                                className="shadow-[0_0_10px_2px_#e53603] w-full bg-[#e53603] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#e53603]/80"
                            >
                                Cancel
                            </button>
                            {wallet?.withdrawal_account.account_number ? (
                                <button
                                    onClick={handleWithdraw}
                                    className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80"
                                >
                                    Withdraw
                                </button>
                            ) : (
                                <button
                                    onClick={handleSetAccount}
                                    className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80"
                                >
                                    Set Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {show && <PopUpModal text={msg} type={status} setShow={setShow} />}
        </>
    );
}

