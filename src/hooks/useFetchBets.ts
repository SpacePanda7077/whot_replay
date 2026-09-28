import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../store/auth-store";
import { useHistoryStore } from "../store/history";
import { Get_Bets } from "../api/bet-api";
import { useEffect } from "react";

export const useFetchBets = () => {
    const logs = useAuth((s) => s.login_result);
    const setBets = useHistoryStore((s) => s.setBets);
    const {
        data: betData,
        error: betError,
        refetch,
    } = useQuery({
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

    return { getBetHistory: refetch };
};

