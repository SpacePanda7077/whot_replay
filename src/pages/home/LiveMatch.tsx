import LiveMatchTopInfo from "./LiveMatchTopInfo";
interface Prop {
    id: string;
    teams: { name: string; odds: number }[];
}

export default function LiveMatch({ id, teams }: Prop) {
    return (
        <>
            <div className="p-4 border border-[#ffa500]/20 bg-[#310420] rounded-lg">
                <LiveMatchTopInfo id={id} />
                <div className="mt-2">
                    <div className="flex gap-4 items-center">
                        <div className=" w-full flex justify-between items-center p-3 border border-white/20 rounded-lg bg-[#240218]">
                            <div className="flex items-center gap-2 text-white/30">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <h1>{teams[0].name}</h1>
                            </div>
                            <p className="text-white/40">{teams[0].odds}x</p>
                        </div>
                        <h2 className="text-white/30">VS</h2>
                        <div className=" w-full flex justify-between items-center p-3 border border-white/20 rounded-lg bg-[#240218]">
                            <div className="flex items-center gap-2 text-white/30">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <h1>{teams[1].name}</h1>
                            </div>
                            <p className="text-white/40">{teams[1].odds}x</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

