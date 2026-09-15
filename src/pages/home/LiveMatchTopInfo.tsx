import { CiLock } from "react-icons/ci";
interface Prop {
    id: string;
}
export default function LiveMatchTopInfo({ id }: Prop) {
    return (
        <>
            <div>
                <div className="flex items-center justify-between">
                    <div className="text-[10px] flex items-center gap-4">
                        <div className="flex gap-2 items-center text-white bg-[#ff3d00] w-fit py-1 px-2 rounded-lg">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <p>LIVE</p>
                        </div>
                        <div className="flex gap-2 items-center text-[#ff3d00] bg-[#ff3d00]/20 w-fit py-1 px-2 rounded-lg">
                            <CiLock size={16} />
                            <p>Betting Locked</p>
                        </div>
                        <p className="text-white/70">Match #{id}</p>
                    </div>
                    <p className="text-white/70 text-sm">Pari Mutual</p>
                </div>
            </div>
        </>
    );
}

