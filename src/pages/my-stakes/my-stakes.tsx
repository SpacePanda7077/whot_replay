import Header from "../../components/header/Header";
import StakeDashboard from "./stake-dashboard";
import StakeHistory from "./stake-history";
import { useFetchBets } from "../../hooks/useFetchBets";
import { useStakeGames } from "../../hooks/useStakeGames";

export default function MyStakes() {
    useFetchBets();
    useStakeGames();
    return (
        <>
            <Header />
            <div className="flex flex-col gap-4 items-center justify-center mt-30 text-white/70 ">
                <StakeDashboard />
                <StakeHistory />
            </div>
        </>
    );
}

