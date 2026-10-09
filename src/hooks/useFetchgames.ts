import { useQuery } from "@tanstack/react-query";
import { useReplayStore } from "../store/replay.store";
import { GetAccumulatorReplays, GetGames } from "../api/games-api";
import { useEffect } from "react";
import { useAuth } from "../store/auth-store";
import { replace } from "react-router";

export const useFetchGames = () => {
    const user = useAuth((s) => s.login_result);
    const setReplays = useReplayStore((s) => s.setReplays);
    const setAccumulator = useReplayStore((s) => s.setAccumulator);
    const setLiveReplay = useReplayStore((s) => s.setLiveReplay);

    const { data: Accumulators, error: GetAccumulatorError } = useQuery({
        queryKey: ["get_accumulators"],
        queryFn: () => GetAccumulatorReplays(),
    });

    const {
        data: Replays,
        error: GetReplaysError,
        refetch,
    } = useQuery({
        queryKey: ["get_replays"],
        queryFn: () => GetGames(),
    });

    useEffect(() => {
        if (Accumulators) {
            console.log(Accumulators);
            setAccumulator(Accumulators.accumulators);
        }
        if (GetAccumulatorError) {
            console.log(GetAccumulatorError);
        }
    }, [Accumulators, GetAccumulatorError]);

    useEffect(() => {
        if (Replays) {
            console.log(Replays);
            setReplays(Replays.games);
        }
        if (GetReplaysError) {
            console.log(GetReplaysError);
        }
    }, [Replays, GetReplaysError]);

    return { refetchGames: refetch };
};

