import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAccumulatorReplays, GetGames } from "../api/games-api";
import { useHistoryStore } from "../store/history";
import { useReplayStore } from "../store/replay.store";

const POLL_MS = 5_000;

// The stakes page needs to know which games are locked/playing, but the
// game list is normally only loaded on Home. Load it here and keep it
// fresh while there is at least one unsettled bet.
export const useStakeGames = () => {
    const setReplays = useReplayStore((s) => s.setReplays);
    const setAccumulator = useReplayStore((s) => s.setAccumulator);
    const has_placed = useHistoryStore((s) =>
        s.bets.some((b) => b.status === "placed"),
    );

    const { data: games } = useQuery({
        queryKey: ["get_replays"],
        queryFn: () => GetGames(),
        refetchInterval: has_placed ? POLL_MS : false,
    });

    const { data: accumulators } = useQuery({
        queryKey: ["get_accumulators"],
        queryFn: () => GetAccumulatorReplays(),
        refetchInterval: has_placed ? POLL_MS : false,
    });

    useEffect(() => {
        if (games?.games) setReplays(games.games);
    }, [games, setReplays]);

    useEffect(() => {
        if (accumulators?.accumulators) {
            setAccumulator(accumulators.accumulators);
        }
    }, [accumulators, setAccumulator]);
};
