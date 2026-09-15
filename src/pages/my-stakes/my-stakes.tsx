import Header from "../../components/header/Header";
import StakeDashboard from "./stake-dashboard";
import StakeHistory from "./stake-history";

export default function MyStakes() {
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

