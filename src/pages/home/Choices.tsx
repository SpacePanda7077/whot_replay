import { Players } from "../../store/replay.store";

interface Prop {
    id: string;
    teams: Players;
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
                    <div
                        onClick={() => handleBet(id, teams[0].team)}
                        className={` w-full flex justify-between items-center
                                 p-3 border border-white/20 rounded-lg cursor-pointer
                                 ${choosenBet.game_id === id && choosenBet.team === "orange" ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]" : "bg-[#4a0a32] text-white"}
                                 `}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <h1>{`${teams[0].full_name.split(" ")[0]}`}</h1>
                        </div>
                    </div>
                    <h2 className="text-white/30">VS</h2>
                    <div
                        onClick={() => handleBet(id, teams[1].team)}
                        className={` w-full flex justify-between items-center
                                 p-3 border border-white/20 rounded-lg cursor-pointer
                                 ${choosenBet.game_id === id && choosenBet.team === "blue" ? "bg-[#ffa400] text-[#310420] shadow-[0_0_10px_2px_#ffa400]" : "bg-[#4a0a32] text-white"}
                                 `}
                    >
                        <div className="flex items-center gap-2 ">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h1>{`${teams[1].full_name.split(" ")[0]} `}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

