import { useQuery } from "@tanstack/react-query";
import { useReplayStore } from "../store/replay.store";
import { GetAccumulatorReplays, GetGames, GetReplays } from "../api/games-api";
import { useEffect } from "react";
import { useAuth } from "../store/auth-store";
import { replace } from "react-router";

export const useFetchGames = () => {
    const user = useAuth((s) => s.login_result);
    const setReplays = useReplayStore((s) => s.setReplays);
    const setLiveReplay = useReplayStore((s) => s.setLiveReplay);

    const { data: Accumulators, error: GetAccumulatorError } = useQuery({
        queryKey: ["get_accumulators"],
        queryFn: () => GetAccumulatorReplays(user!.token),
        enabled: user !== null,
    });

    const {
        data: Replays,
        error: GetReplaysError,
        refetch,
    } = useQuery({
        queryKey: ["get_replays"],
        queryFn: () => GetGames(user!.token),
    });

    useEffect(() => {
        if (Accumulators) {
            console.log(Accumulators);
            // setReplays(Accumulators.replays);
        }
        if (GetAccumulatorError) {
            console.log(GetAccumulatorError);
        }
    }, [Accumulators, GetAccumulatorError]);

    useEffect(() => {
        if (Replays) {
            console.log(Replays);
            setReplays(Replays.games);
            const lockedgames = Replays.games.filter(
                (r: { status: string }) => r.status === "locked",
            );
            console.log("Locked games : ", lockedgames);
            const liveReplays = lockedgames.splice(0, 3);
            console.log(liveReplays);

            setLiveReplay(liveReplays);
        }
        if (GetReplaysError) {
            console.log(GetReplaysError);
        }
    }, [Replays, GetReplaysError]);

    return { refetchGames: refetch };
};

