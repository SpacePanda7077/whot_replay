import { useEffect, useState } from "react";
import { useAccumulatedOddStore } from "../../store/accumulator.store";
import UpcomingMatchTopInfo from "./UpcomingMatchTopInfo";
interface Prop {
    id: string;
    teams: { team: string; name: string; odds: number }[];
}

export default function UpcomingMatch({ id, teams }: Prop) {
    const [selected_team, setSelectedTeam] = useState("");
    const add_odds = useAccumulatedOddStore((s) => s.add_odds);
    const accumulated_odds = useAccumulatedOddStore((s) => s.accumulated_odds);
    const calculate_total_odds = useAccumulatedOddStore(
        (s) => s.calculate_total_odds,
    );
    const handle_add_odd = (team: string) => {
        const odds = {
            id: id,
            team,
        };
        add_odds(odds);
        calculate_total_odds();
    };
    useEffect(() => {
        const exist = accumulated_odds.find((a) => a.id === id);
        setSelectedTeam(exist ? exist.team : "");
    }, [accumulated_odds]);
    return (
        <>
            <div className="p-4 border border-[#ffa500]/20 rounded-lg  shadow-lg">
                <UpcomingMatchTopInfo id={id} />
                <div className="mt-2">
                    <div className="flex gap-4 items-center ">
                        <div
                            onClick={() => handle_add_odd(teams[0].team)}
                            className={` w-full flex justify-between items-center
                                 p-3 border border-white/20 rounded-lg 
                                 ${selected_team === "orange" ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]" : "bg-[#4a0a32] text-white"}
                                 `}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <h1>{teams[0].name}</h1>
                            </div>
                            <p className="">{teams[0].odds.toFixed(2)}x</p>
                        </div>
                        <h2 className="text-white/30">VS</h2>
                        <div
                            onClick={() => handle_add_odd(teams[1].team)}
                            className={` w-full flex justify-between items-center
                                 p-3 border border-white/20 rounded-lg 
                                 ${selected_team === "blue" ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]" : "bg-[#4a0a32] text-white"}
                                 `}
                        >
                            <div className="flex items-center gap-2 ">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <h1>{teams[1].name}</h1>
                            </div>
                            <p className="">{teams[1].odds}x</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

