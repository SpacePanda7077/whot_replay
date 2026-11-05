import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useReplayStore } from "../store/replay.store";
import { useAuth } from "../store/auth-store";
import { GetAccumulatorReplays, GetGames } from "../api/games-api";

// How often to look again while there is nothing to bet on.
const RETRY_MS = 3000;

// A game people can still bet on (or will soon be able to).
const has_bettable_game = (games?: { status: string }[]) =>
    !!games?.some((g) => g.status === "scheduled" || g.status === "open");

export const useFetchGames = () => {
    const setReplays = useReplayStore((s) => s.setReplays);
    const setAccumulator = useReplayStore((s) => s.setAccumulator);
    const isLoggedIn = useAuth((s) => s.isLoggedIn());

    const {
        data: Accumulators,
        error: GetAccumulatorError,
        refetch: refetchAccumulators,
    } = useQuery({
        queryKey: ["get_accumulators"],
        queryFn: () => GetAccumulatorReplays(),
    });

    // Keep asking until the server returns at least one scheduled/open game.
    // The interval is switched off once one is found, and switches back on if
    // they all lock or end. It also keeps going after a failed request.
    const {
        data: Replays,
        error: GetReplaysError,
        refetch,
    } = useQuery({
        queryKey: ["get_replays"],
        queryFn: () => GetGames(),
        refetchInterval: (...args: unknown[]) => {
            if (!isLoggedIn) return false;
            // react-query v4 passes (data, query), v5 passes (query)
            const first = args[0] as any;
            const data = first?.state ? first.state.data : first;
            return has_bettable_game(data?.games) ? false : RETRY_MS;
        },
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

