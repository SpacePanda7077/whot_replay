import { useQuery } from "@tanstack/react-query";
import Header from "../../components/header/Header";
import StakeDashboard from "./stake-dashboard";
import StakeHistory from "./stake-history";
import { Get_Bets } from "../../api/bet-api";
import { useAuth } from "../../store/auth-store";
import { useEffect } from "react";
import { useHistoryStore } from "../../store/history";

export default function MyStakes() {
    const logs = useAuth((s) => s.login_result);
    const setBets = useHistoryStore((s) => s.setBets);
    const { data: betData, error: betError } = useQuery({
        queryKey: ["get_bets"],
        queryFn: () => Get_Bets(logs!.token),
        enabled: logs !== null,
    });

    useEffect(() => {
        if (betData) {
            console.log(betData.data);
            setBets(betData.data.bets);
        }
        if (betError) {
            console.log(betError);
        }
    }, [betData, betError]);

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

