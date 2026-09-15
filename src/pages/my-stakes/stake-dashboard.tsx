export default function StakeDashboard() {
    return (
        <>
            <div className=" w-[90vw] lg:w-[50vw] rounded-lg flex justify-between gap-4">
                <div className="flex flex-col gap-2 bg-[#2e041d] p-2 rounded-lg w-full border border-[#FFB800]/20">
                    <p className="text-xs">Total Staked</p>
                    <h2 className="text-lg text-white font-bold">₦48,000</h2>
                </div>
                <div className="flex flex-col gap-2 bg-[#2e041d] p-2 rounded-lg w-full border border-[#FFB800]/20">
                    <p className="text-xs">Net Profit</p>
                    <h2 className="text-lg text-[#22C55E] font-bold">
                        +₦11,950
                    </h2>
                </div>
            </div>
        </>
    );
}

