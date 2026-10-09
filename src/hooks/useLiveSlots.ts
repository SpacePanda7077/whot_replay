import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetGames } from "../api/games-api";
import { EventBus } from "../game/EventBus";
import { useReplayStore } from "../store/replay.store";

const POLL_MS = 10_000; // refetch /api/replays
const CHECK_MS = 5_000; // re-check end times between refetches
const END_LINGER_MS = 5_000; // keep the finished board on screen briefly

// Owns the three live slots: keeps the replay list fresh and swaps any game
// that has ended for another locked game that isn't already in a slot.
// Call it once (Home). Nothing else should overwrite live_replay.
export function useLiveSlots() {
    const setReplays = useReplayStore((s) => s.setReplays);
    const sync = useReplayStore((s) => s.syncLiveReplays);
    const markEnded = useReplayStore((s) => s.markEnded);

    // If you already fetch /api/replays elsewhere, use the same queryKey so
    // the request is shared instead of doubled.
    const { data } = useQuery({
        queryKey: ["replays"],
        queryFn: GetGames,
        refetchInterval: POLL_MS,
    });

    // New data: store it, then fill/replace slots.
    useEffect(() => {
        if (!Array.isArray(data)) return;
        setReplays(data);
        sync();
    }, [data, setReplays, sync]);

    // A game can end between refetches, so also check on a timer.
    useEffect(() => {
        const t = setInterval(sync, CHECK_MS);
        return () => clearInterval(t);
    }, [sync]);

    // The stream's "end" event is the authoritative signal for the game
    // being watched.
    useEffect(() => {
        const timers = new Set<ReturnType<typeof setTimeout>>();

        const on_end = (d: { game_id: string }) => {
            const t = setTimeout(() => {
                timers.delete(t);
                markEnded(d.game_id);
                sync();
            }, END_LINGER_MS);
            timers.add(t);
        };

        EventBus.on("game_end", on_end);
        return () => {
            EventBus.off("game_end", on_end);
            timers.forEach(clearTimeout);
        };
    }, [markEnded, sync]);
}

