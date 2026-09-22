import { useCallback, useState } from "react";
import PaymentMethodList from "./PaymentMethodList";
import { useAuth } from "../../store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { Deposit } from "../../api/wallet-api";
import PopUpModal from "../../components/popup-modal";

interface Prop {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DepositModal({ setOpen }: Prop) {
    const [amount, setAmount] = useState<number>();
    const [email, setEmail] = useState<string>("");
    const [paymentMethodSelectionOpen, setPaymentMethodSelectionOpen] =
        useState(false);
    const [selectedMethod, setSelectedMethod] = useState(
        "Select payment method",
    );

    const logs = useAuth((s) => s.login_result);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");

    const { mutate } = useMutation({
        mutationKey: ["deposit_funds"],
        mutationFn: (data: {
            token: string;
            data: { amount: number; provider: string };
        }) => Deposit(data.token, data.data),
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
                setMsg("COULDN'T START DEPOSIT");
            } else if (statusCode === 503) {
                setMsg("DEPOSIT NOT CONFIGURED");
            } else {
                setMsg("ERROR WHILE DEPOSITING");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });

    // 💡 You can now delete the entire useEffect hook!

    const handleDeposit = useCallback(() => {
        if (!logs || !amount || amount <= 0) return;
        mutate({
            token: logs.token,
            data: { amount: amount, provider: "opay" },
        });
    }, [logs, amount]);
    return (
        <>
            <div className="z-50 mt-10 fixed top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center  backdrop-blur-lg">
                <div className="flex flex-col gap-6 bg-[#370723] border border-[#FFB800]/20 rounded-lg w-[50vw] h-auto p-4 w-[95vw] md:w-[70vw] lg:w-[50vw]">
                    <h2 className="text-white text-md font-bold">
                        Deposit Funds
                    </h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label>Email</label>
                            <input
                                type="text"
                                // value={email}
                                className="bg-white/5 w-full p-2 rounded text-white font-bold placeholder:text-white/40"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <label>Bank Name</label>
                                <div
                                    onClick={() =>
                                        setPaymentMethodSelectionOpen(
                                            (prev) => !prev,
                                        )
                                    }
                                    className="relative bg-white/5 w-[80%] md:w-1/2 h-10 p-2 rounded text-white font-bold placeholder:text-white/40"
                                >
                                    {selectedMethod}
                                    {paymentMethodSelectionOpen && (
                                        <PaymentMethodList
                                            setSelected={setSelectedMethod}
                                        />
                                    )}
                                </div>
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
                            <button
                                onClick={handleDeposit}
                                className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80"
                            >
                                Deposit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <PopUpModal text={msg} type={status} setShow={setShow} />}
        </>
    );
}

