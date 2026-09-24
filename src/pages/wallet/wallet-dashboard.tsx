import { CiWallet } from "react-icons/ci";
import DepositDashboard from "./deposit-dashboard";
import { useWalletStore } from "../../store/wallet-store";
interface Prop {
    refetch: () => void;
}
export default function WalletDashboard({ refetch }: Prop) {
    const wallet = useWalletStore((s) => s.wallet);
    return (
        <>
            <div className="border border-[#FFB800]/20 w-[95vw] md:w-[70vw] lg:w-[50vw] p-2 rounded-lg flex flex-col gap-2 bg-[#2e041d]">
                <div className="flex gap-2">
                    <CiWallet size={24} color="#FFB800" />
                    <h2>Current Balance</h2>
                </div>
                <h1 className="text-white text-3xl font-bold">
                    ₦{wallet?.balance.toLocaleString() || 0}
                </h1>
                <div className="flex item-center gap-4">
                    <p className="text-sm text-white/70">
                        Lifetime deposit:
                        <span className="text-[#44E305] font-bold">
                            {" "}
                            ₦48,000
                        </span>
                    </p>
                    <p className="text-sm text-white/70">
                        Lifetime withdraw:
                        <span className=" font-bold text-[#e43604]">
                            {" "}
                            ₦48,000
                        </span>
                    </p>
                </div>

                <DepositDashboard refetch={refetch} />
            </div>
        </>
    );
}

