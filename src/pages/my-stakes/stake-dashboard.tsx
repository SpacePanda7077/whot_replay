import { useHistoryStore } from "../../store/history";

export default function StakeDashboard() {
    const totalStake = useHistoryStore((s) => s.total_staked);
    const netProfitLoss = useHistoryStore((s) => s.net_profiit);
    return (
        <>
            <div className=" w-[90vw] lg:w-[50vw] rounded-lg flex justify-between gap-4">
                <div className="flex flex-col gap-2 bg-[#2e041d] p-2 rounded-lg w-full border border-[#FFB800]/20">
                    <p className="text-xs">Total Staked</p>
                    <h2 className="text-lg text-white font-bold">
                        ₦{totalStake.toLocaleString()}
                    </h2>
                </div>
                <div className="flex flex-col gap-2 bg-[#2e041d] p-2 rounded-lg w-full border border-[#FFB800]/20">
                    <p className="text-xs">Net Profit</p>
                    <h2 className="text-lg text-[#22C55E] font-bold">
                        ₦{netProfitLoss.toLocaleString()}
                    </h2>
                </div>
            </div>
        </>
    );
}

