export default function StakeComponent() {
    return (
        <>
            <div className="flex flex-col gap-2 bg-[#2E041D] p-4 rounded-lg border border-[#FFB800]/20">
                <div className="flex justify-between text-xs">
                    <p className="bg-white/5 px-4 py-1 rounded-lg font-semibold">
                        single
                    </p>
                    <div>Active</div>
                </div>
                <div className="flex items-center justify-between border-b border-b-white/20 pb-4">
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                            <p className="font-semibold">Team Orange</p>
                            <p className="text-xs">Match #8092 · 2h ago</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-xs">1.8x</p>
                        <p className="text-white font-bold">₦1,000</p>
                    </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <p>Staked</p>
                    <p>Awaiting Results</p>
                </div>
            </div>
        </>
    );
}

