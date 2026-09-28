import StartSoonTag from "../../components/start-soon-tag";
import { Players } from "../../store/replay.store";

interface Prop {
    id: string;
    teams: Players;
    status: string;
    choosenBet: {
        game_id: string;
        team: string;
    };
    setChoosenBet: React.Dispatch<
        React.SetStateAction<{
            game_id: string;
            team: string;
        }>
    >;
}
export default function Choices({
    id,
    teams,
    status,
    choosenBet,
    setChoosenBet,
}: Prop) {
    const handleBet = (game_id: string, team: string) => {
        setChoosenBet({
            game_id,
            team,
        });
    };
    return (
        <>
            <div className="mt-2">
                <div className="flex gap-4 items-center ">
                    <button
                        disabled={status === "scheduled"}
                        onClick={() => handleBet(id, teams[0].team)}
                        style={{ opacity: status === "scheduled" ? 0.4 : 1 }}
                        className={`relative w-full flex justify-between items-center
                                 p-1 border border-white/20 rounded-lg cursor-pointer
                                 ${choosenBet.game_id === id && choosenBet.team === "orange" ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]" : "bg-[#4a0a32] text-white"}
                                 `}
                    >
                        <div className="flex items-center justify-between w-full ">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <h1>{`${teams[0].full_name.split(" ")[0]} `}</h1>
                            </div>
                            {status === "open" && (
                                <p className="text-xs"> 1.20x</p>
                            )}
                        </div>
                    </button>
                    <h2 className="text-white/30">VS</h2>
                    <button
                        disabled={status === "scheduled"}
                        onClick={() => handleBet(id, teams[1].team)}
                        style={{ opacity: status === "scheduled" ? 0.3 : 1 }}
                        className={` w-full flex justify-between items-center
                                 p-1 border border-white/20 rounded-lg cursor-pointer
                                 ${choosenBet.game_id === id && choosenBet.team === "blue" ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]" : "bg-[#4a0a32] text-white"}
                                 `}
                    >
                        <div className="flex items-center justify-between w-full ">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <h1>{`${teams[1].full_name.split(" ")[0]} `}</h1>
                            </div>
                            {status === "open" && (
                                <p className="text-xs"> 2.20x</p>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}

