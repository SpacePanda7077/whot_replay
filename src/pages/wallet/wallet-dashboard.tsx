import { CiWallet } from "react-icons/ci";
import DepositDashboard from "./deposit-dashboard";

export default function WalletDashboard() {
    return (
        <>
            <div className="border border-[#FFB800]/20 w-[95vw] md:w-[70vw] lg:w-[50vw] p-2 rounded-lg flex flex-col gap-2 bg-[#2e041d]">
                <div className="flex gap-2">
                    <CiWallet size={24} color="#FFB800" />
                    <h2>Current Balance</h2>
                </div>
                <h1 className="text-white text-3xl font-bold">₦25,400</h1>
                <div>
                    <p className="text-sm text-white/70">
                        Lifetime staked:
                        <span className="text-white font-bold"> ₦48,000</span>
                    </p>
                </div>

                <DepositDashboard />
            </div>
        </>
    );
}

