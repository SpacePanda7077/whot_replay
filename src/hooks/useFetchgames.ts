import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useReplayStore } from "../store/replay.store";
import { GetAccumulatorReplays, GetGames } from "../api/games-api";

export const useFetchGames = () => {
    const setReplays = useReplayStore((s) => s.setReplays);
    const setAccumulator = useReplayStore((s) => s.setAccumulator);

    const {
        data: Accumulators,
        error: GetAccumulatorError,
        refetch: refetchAccumulators,
    } = useQuery({
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
            console.log("Accumulators", Accumulators);
            setAccumulator(Accumulators.accumulators);
        }
        if (GetAccumulatorError) {
            console.log(GetAccumulatorError);
        }
    }, [Accumulators, GetAccumulatorError]);

    useEffect(() => {
        if (Replays) {
            setReplays(Replays.games);
            console.log("Replays", Replays);
        }
        if (GetReplaysError) {
            console.log(GetReplaysError);
        }
    }, [Replays, GetReplaysError]);

    return { refetchGames: refetch, refetchAccumulators };
};
