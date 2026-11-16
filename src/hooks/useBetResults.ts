import { useCallback, useEffect, useRef, useState } from "react";
import { EventBus } from "../game/EventBus";
import {
    bet,
    bet_key,
    is_accumulator,
    useHistoryStore,
} from "../store/history";

// Shows the result modal for the user's single bets on a game.
//
// - As soon as the user starts watching a game that already has a
//   "refunded" bet, the modal appears immediately (so they don't sit
//   through a lopsided game thinking they can still win).
// - When the stream ends, any newly settled won/lost/refunded bets
//   on that game are also shown.
export function useBetResults(currentGameId?: string | null) {
    const bets = useHistoryStore((s) => s.bets);
    const [ended_games, setEndedGames] = useState<string[]>([]);
    const [results, setResults] = useState<bet[]>([]);
    const announced = useRef(new Set<string>());

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

    // 1) Immediate refund check: as soon as we are watching a game that
    //    already has a refunded bet, show the modal right away.
    useEffect(() => {
        if (!currentGameId) return;

        const already_refunded = bets.filter(
            (b) =>
                !is_accumulator(b) &&
                !!b.game_id &&
                String(b.game_id) === String(currentGameId) &&
                b.status === "refunded" &&
                !announced.current.has(bet_key(b)),
        );

        if (already_refunded.length === 0) return;

        already_refunded.forEach((b) => announced.current.add(bet_key(b)));
        setResults((prev) => [...prev, ...already_refunded]);
    }, [bets, currentGameId]);

    // 2) After the game ends, surface any settled (won / lost / refunded) bets
    //    that we haven't already announced.
    useEffect(() => {
        if (ended_games.length === 0) return;

        const fresh = bets.filter(
            (b) =>
                !is_accumulator(b) &&
                !!b.game_id &&
                ended_games.includes(String(b.game_id)) &&
                b.status !== "placed" &&
                !announced.current.has(bet_key(b)),
        );

        if (fresh.length === 0) return;

        fresh.forEach((b) => announced.current.add(bet_key(b)));
        setResults((prev) => [...prev, ...fresh]);
    }, [bets, ended_games]);

    const dismiss = useCallback(() => setResults([]), []);

    return { results, dismiss };
}

