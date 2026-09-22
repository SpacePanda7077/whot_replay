import { useHistoryStore } from "../../store/history";
import StakeComponent from "./stake-component";
import StakeFilter from "./stake-filter";

export default function StakeHistory() {
    const bets = useHistoryStore((s) => s.bets);
    return (
        <>
            <div className=" w-[90vw] lg:w-[50vw] flex flex-col gap-4">
                <div className="w-full">
                    <StakeFilter />
                </div>

                <div className="flex flex-col gap-2">
                    {bets.map((bet, i) => (
                        <StakeComponent key={bet.id} bet={bet} />
                    ))}
                </div>
            </div>
        </>
    );
}

