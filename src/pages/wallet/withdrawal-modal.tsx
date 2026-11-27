import { useCallback, useEffect, useMemo, useState } from "react";
import PaymentMethodList from "./PaymentMethodList";
import { useAuth } from "../../store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetBanks, SetWallet, Withdraw } from "../../api/wallet-api";
import PopUpModal from "../../components/popup-modal";
import { useWalletStore } from "../../store/wallet-store";

interface Prop {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: () => void;
}

export default function WithdrawalModal({ setOpen, refetch }: Prop) {
    const queryClient = useQueryClient();
    const [accountName, setAccountName] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [bankSelectionOpen, setBankSelectionOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState<{
        name: string;
        code: string;
    }>({ name: "", code: "" });
    const wallet = useWalletStore((s) => s.wallet);

    const logs = useAuth((s) => s.login_result);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");

    const { data: Banks, error: GetBanksError } = useQuery({
        queryKey: ["get_bank_list"],
        queryFn: () => GetBanks(logs?.token!),
        enabled: logs !== null,
    });

    const banks: { name: string; code: string }[] = useMemo(
        () => Banks?.data?.banks ?? [],
        [Banks],
    );

    useEffect(() => {
        if (GetBanksError) {
            console.log(GetBanksError);
        }
    }, [GetBanksError]);

    // Banks matching what's typed; names starting with the query come first
    const filteredBanks = useMemo(() => {
        const q = selectedBank.name.trim().toLowerCase();
        if (!q) return banks;

        return banks
            .filter((b) => b.name.toLowerCase().includes(q))
            .sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
                const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
                return aStarts - bStarts;
            });
    }, [banks, selectedBank]);

    const { mutate: withdraw, isPending: isWithdrawing } = useMutation({
        mutationKey: ["withdraw_funds"],
        mutationFn: (data: { token: string; data: { amount: number } }) =>
            Withdraw(data.token, data.data),
        onSuccess: (data) => {
            if (data?.status === 200 || data?.status === 201) {
                setMsg("Withdrawal SUCCESSFULLY");
                setStatus("SUCCESS");
                setShow(true);
                // Balance changed: refresh it and the transaction list.
                queryClient.invalidateQueries({
                    queryKey: ["get_wallet_info"],
                });
                queryClient.invalidateQueries({ queryKey: ["getTxQuery"] });
            }
            console.log(data);
        },
        onError: (err: any) => {
            console.error(err);

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

    const { mutate: set_account, isPending: isSettingAccount } = useMutation({
        mutationKey: ["set_account"],
        mutationFn: (data: {
            token: string;
            data: {
                account_name: string;
                bank_name: string;
                account_number: string;
            };
        }) => SetWallet(data.token, data.data),
        onSuccess: (data) => {
            if (data?.status === 200 || data?.status === 201) {
                setMsg("ACCOUNT SET SUCCESSFULLY");
                setStatus("SUCCESS");
                setShow(true);
                refetch();
            }
            console.log(data);
        },
        onError: (err: any) => {
            console.error(err);

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

    const handleWithdraw = useCallback(() => {
        if (isWithdrawing) return; // ignore clicks while a withdrawal is in flight

        if (!logs || !amount || Number(amount) <= 0) return;
        withdraw({
            token: logs.token,
            data: { amount: Number(amount) },
        });
    }, [logs, amount, withdraw, isWithdrawing]);

    const handleSetAccount = useCallback(() => {
        if (isSettingAccount) return;
        if (!logs || !accountName || !accountNumber || !selectedBank) return;
        // Only allow a bank that actually exists in the list
        if (!banks.some((b) => b.name === selectedBank.name)) return;

        console.log("Setting account ...");
        set_account({
            token: logs.token,
            data: {
                account_name: accountName,
                account_number: accountNumber,
                bank_name: selectedBank.code,
            },
        });
    }, [
        logs,
        accountName,
        accountNumber,
        selectedBank,
        banks,
        set_account,
        isSettingAccount,
    ]);
    const getBankNameFromCode = (code: string) => {
        const b = banks.find((bank) => bank.code === code);
        return b;
    };

    useEffect(() => {
        if (!banks) return;
        if (wallet?.withdrawal_account) {
            setAccountName(wallet.withdrawal_account.account_name ?? "");
            setAccountNumber(wallet.withdrawal_account.account_number ?? "");
            const bank = getBankNameFromCode(
                wallet.withdrawal_account.bank_name,
            );
            console.log(bank);
            setSelectedBank({
                name: bank?.name ?? "",
                code: bank?.code ?? "",
            });
        }
    }, [wallet, banks]);

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
                            <div className="relative bg-white/5 w-1/2 h-10 p-2 rounded text-white font-bold">
                                <input
                                    type="text"
                                    value={selectedBank.name}
                                    placeholder="Select Bank"
                                    onFocus={() => setBankSelectionOpen(true)}
                                    onBlur={() => setBankSelectionOpen(false)}
                                    onChange={(e) => {
                                        setSelectedBank({
                                            name: e.target.value,
                                            code: "",
                                        });
                                        setBankSelectionOpen(true);
                                    }}
                                    className="w-full h-full outline-none placeholder:text-white/40"
                                />
                                {bankSelectionOpen && (
                                    <PaymentMethodList
                                        setSelected={setSelectedBank}
                                        onPick={() =>
                                            setBankSelectionOpen(false)
                                        }
                                        bankList={filteredBanks}
                                    />
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
                                value={amount ?? ""}
                                onChange={(e) => setAmount(e.target.value)}
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
                            {wallet?.withdrawal_account.account_number &&
                            accountNumber ===
                                wallet.withdrawal_account.account_number &&
                            selectedBank.code ===
                                wallet.withdrawal_account.bank_name ? (
                                <button
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing}
                                    className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {isWithdrawing
                                        ? "Processing..."
                                        : "Withdraw"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSetAccount}
                                    disabled={isSettingAccount}
                                    className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {isSettingAccount
                                        ? "Saving..."
                                        : "Set Account"}
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
