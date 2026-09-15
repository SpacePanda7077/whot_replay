import { useState } from "react";
import DepositModal from "./deposit-modal";
import WithdrawalModal from "./withdrawal-modal";

export default function DepositDashboard() {
    const [depositOpen, setDepositOpen] = useState(false);
    const [withdrawalOpen, setWithdrawalOpen] = useState(false);
    return (
        <>
            <div className="mt-6">
                <div className="w-full flex gap-4 ">
                    <button
                        onClick={() => setDepositOpen(true)}
                        className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80"
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => setWithdrawalOpen(true)}
                        className="shadow-[0_0_10px_2px_#ffa400] w-full bg-[#FFB800] text-[#2e041d] font-bold py-2 px-4 rounded hover:bg-[#FFB800]/80"
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {depositOpen && <DepositModal setOpen={setDepositOpen} />}
            {withdrawalOpen && <WithdrawalModal setOpen={setWithdrawalOpen} />}
        </>
    );
}

