import { useCallback, useEffect, useRef, useState } from "react";
import { EventBus } from "../game/EventBus";
import { bet, bet_key, is_accumulator, useHistoryStore } from "../store/history";

// Collects the outcome of the user's single bets on a game they were
// watching, once that game's stream has ended. The outcome (won / lost /
// refunded) always comes from the server's bet status, so refunds and
// payouts are exact. If the server hasn't settled yet, the modal appears
// as soon as the next bet refresh brings the result in.
export function useBetResults() {
    const bets = useHistoryStore((s) => s.bets);
    const [ended_games, setEndedGames] = useState<string[]>([]);
    const [results, setResults] = useState<bet[]>([]);
    const announced = useRef(new Set<string>());

    // The stream's "end" event only fires for the game being watched.
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
