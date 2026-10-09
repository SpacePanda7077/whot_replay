import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../store/auth-store";
import { bet, useHistoryStore } from "../store/history";
import { Get_Accumulator_Bets, Get_Bets } from "../api/bet-api";
import { useEffect, useState } from "react";

export const useFetchBets = () => {
    const logs = useAuth((s) => s.login_result);
    const bets = useHistoryStore((s) => s.bets);
    const setBets = useHistoryStore((s) => s.setBets);
    const [singleBets, setSingleBets] = useState<bet[]>([]);
    const [accumulatorBets, setAccumulatorBets] = useState<bet[]>([]);
    const {
        data: betData,
        error: betError,
        refetch,
    } = useQuery({
        queryKey: ["get_bets"],
        queryFn: () => Get_Bets(logs!.token),
        enabled: logs !== null,
    });

    const {
        data: accumulatorBetData,
        error: accumulatorBetError,
        refetch: refetchAccumulatorBets,
    } = useQuery({
        queryKey: ["get_accumulator_bets"],
        queryFn: () => Get_Accumulator_Bets(logs!.token),
        enabled: logs !== null,
    });

    useEffect(() => {
        if (betData) {
            console.log(betData.data);
            setSingleBets(betData.data.bets);
        }
        if (betError) {
            console.log(betError);
        }
        if (accumulatorBetData) {
            console.log(accumulatorBetData.data);
            setAccumulatorBets(accumulatorBetData.data.bets);
        }
        if (accumulatorBetError) {
            console.log(accumulatorBetError);
        }
    }, [betData, betError, accumulatorBetData, accumulatorBetError]);

    useEffect(() => {
        const combinedBets = [...singleBets, ...accumulatorBets];
        setBets(combinedBets);
    }, [singleBets, accumulatorBets]);
    return {
        getBetHistory: refetch,
        getAccumulatorBetHistory: refetchAccumulatorBets,
    };
};

