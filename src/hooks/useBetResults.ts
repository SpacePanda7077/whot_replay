import { useCallback, useEffect, useState } from "react";
import { EventBus } from "../game/EventBus";
import {
    bet,
    bet_key,
    is_accumulator,
    useHistoryStore,
} from "../store/history";

const SEEN_KEY = "announced_bet_results";
// Refunds older than this are treated as already known, so a fresh install
// (or cleared storage) doesn't replay the user's whole history.
const REFUND_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const load_seen = (): Set<string> => {
    try {
        return new Set<string>(
            JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"),
        );
    } catch {
        return new Set<string>();
    }
};

const save_seen = (seen: Set<string>) => {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-300)));
    } catch {
        /* storage unavailable */
    }
};

// Shows the result modal for the user's bets.
//
// - As soon as the user is watching ANY game, every refunded bet that has not
//   been announced yet is shown, whichever game it belongs to. Singles and
//   accumulators are both included.
// - When a stream ends, newly settled won/lost/refunded single bets on that
//   game are also shown.
export function useBetResults(currentGameId?: string | null) {
    const bets = useHistoryStore((s) => s.bets);
    const [ended_games, setEndedGames] = useState<string[]>([]);
    const [results, setResults] = useState<bet[]>([]);
    const [announced] = useState(load_seen);

    const announce = useCallback(
        (items: bet[]) => {
            items.forEach((b) => announced.add(bet_key(b)));
            save_seen(announced);
            setResults((prev) => [...prev, ...items]);
        },
        [announced],
    );

    // Stream end → mark the game as finished so we can surface settled bets.
    useEffect(() => {
        const on_end = (d: { game_id: string }) => {
            const id = String(d.game_id);
            setEndedGames((prev) => (prev.includes(id) ? prev : [...prev, id]));
        };
        EventBus.on("game_end", on_end);
        return () => {
            EventBus.off("game_end", on_end);
        };
    }, []);

    // 1) Refund check: runs when a game is on screen, and again whenever the
    //    bets refetch. Not tied to the watched game's id.
    useEffect(() => {
        if (!currentGameId) return;

        const now = Date.now();
        const fresh = bets.filter(
            (b) =>
                b.status === "refunded" &&
                !announced.has(bet_key(b)) &&
                !(now - Date.parse(b.createdtime) > REFUND_MAX_AGE_MS),
        );

        if (fresh.length === 0) return;
        announce(fresh);
    }, [bets, currentGameId, announced, announce]);

    // 2) After a game ends, surface settled (won / lost / refunded) single bets.
    useEffect(() => {
        if (ended_games.length === 0) return;

        const fresh = bets.filter(
            (b) =>
                !is_accumulator(b) &&
                !!b.game_id &&
                ended_games.includes(String(b.game_id)) &&
                b.status !== "placed" &&
                !announced.has(bet_key(b)),
        );

        if (fresh.length === 0) return;
        announce(fresh);
    }, [bets, ended_games, announced, announce]);

    const dismiss = useCallback(() => setResults([]), []);

    return { results, dismiss };
}
