import { Players } from "../../store/replay.store";
import { useGameOdds } from "../../hooks/useOdds";

interface Prop {
    id: string;
    teams: Players;
    status: string;
}

const format_odds = (value?: number) =>
    typeof value === "number" ? `${value.toFixed(2)}x` : "–";

export default function LiveChoices({ id, teams, status }: Prop) {
    const odds = useGameOdds(id);

    const sides = [
        { key: "orange", dot: "bg-orange-500", team: teams[0] },
        { key: "blue", dot: "bg-blue-500", team: teams[1] },
    ] as const;

    return (
        <div className="mt-2">
            <div className="flex gap-4 items-center ">
                {sides.map((side, i) => (
                    <div key={side.key} className="contents">
                        {i === 1 && <h2 className="text-white/30">VS</h2>}
                        <button
                            disabled={status === "scheduled"}
                            style={{
                                opacity: status === "scheduled" ? 0.3 : 1,
                            }}
                            className={` w-full flex justify-between items-center
                                 p-1 border border-white/20 rounded-lg cursor-pointer
                                
                                 `}
                        >
                            <div className="flex items-center justify-between w-full ">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${side.dot}`}
                                    ></div>
                                    <h1>{`${side.team.full_name.split(" ")[0]} `}</h1>
                                </div>
                                {status === "open" && (
                                    <p className="text-xs">
                                        {format_odds(odds?.[side.key])}
                                    </p>
                                )}
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
