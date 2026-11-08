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
    // While any bet is unsettled, keep checking so "placed" turns into
    // won / lost / refunded without a manual refresh.
    const has_placed = bets.some((b) => b.status === "placed");
    const poll = has_placed ? 5000 : false;
    const {
        data: betData,
        error: betError,
        refetch,
    } = useQuery({
        queryKey: ["get_bets"],
        queryFn: () => Get_Bets(logs!.token),
        enabled: logs !== null,
        refetchInterval: poll,
    });

    const {
        data: accumulatorBetData,
        error: accumulatorBetError,
        refetch: refetchAccumulatorBets,
    } = useQuery({
        queryKey: ["get_accumulator_bets"],
        queryFn: () => Get_Accumulator_Bets(logs!.token),
        enabled: logs !== null,
        refetchInterval: poll,
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

