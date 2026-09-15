import { useState } from "react";
import PaymentMethodList from "./PaymentMethodList";

interface Prop {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DepositModal({ setOpen }: Prop) {
    const [amount, setAmount] = useState<number>();
    const suggested_bet_amount = [1000, 5000, 10000, 25000];
    const handle_select = (value: number) => [setAmount(value)];
    const [paymentMethodSelectionOpen, setPaymentMethodSelectionOpen] =
        useState(false);
    const [selectedMethod, setSelectedMethod] = useState(
        "Select payment method",
    );
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
                        <div className="flex flex-col gap-2">
                            <label className="flex item-center gap-2">
                                <input type="radio" name="color" value="red" />
                                Deposit to Whot Africa Replay
                            </label>

                            <label className="flex item-center gap-2">
                                <input type="radio" name="color" value="blue" />
                                Deposit to Whot Africa Game
                            </label>
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
                            <button className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80">
                                Deposit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

