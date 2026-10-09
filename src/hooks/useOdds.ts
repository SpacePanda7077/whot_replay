import { useSyncExternalStore } from "react";
import {
    connect_odds,
    LegsState,
    OddsLeg,
    OddsState,
} from "../api/odds.client";
import { useHistoryStore } from "../store/history";

type OddsMap = Record<string, number>;

// One shared connection for the whole app.
let live: OddsState = new Map();
// Last odds seen per market. Kept after a market locks (the stream sends
// `closed` and drops it) because the odds are final at that point.
let known: OddsState = new Map();
// Same for the per-leg 80/20 split of accumulators.
let known_legs: LegsState = new Map();
let stop: (() => void) | null = null;
const listeners = new Set<() => void>();

// When a market with one of the user's open bets closes, the bet can change
// state right away (a voided accumulator or a leg that never went live is
// refunded). Refetch history shortly after so the open-bets bar catches up.
function handle_closed(id: string | number) {
    const { bets } = useHistoryStore.getState();
    const has_open_bet = bets.some(
        (b) =>
            b.status === "placed" &&
            String(b.accumulator_id ?? b.game_id) === String(id),
    );
    if (!has_open_bet) return;

    setTimeout(() => {
        const { refetch, setRefetch } = useHistoryStore.getState();
        setRefetch(refetch + 1);
    }, 2000);
}

function subscribe(callback: () => void) {
    listeners.add(callback);

    // First subscriber opens the stream.
    if (listeners.size === 1) {
        stop = connect_odds(
            (next, next_legs) => {
                live = next;
                known = new Map([...known, ...next]);
                known_legs = new Map([...known_legs, ...next_legs]);
                listeners.forEach((l) => l());
            },
            { on_closed: handle_closed },
        );
    }

    return () => {
        listeners.delete(callback);
        // Last subscriber closes it.
        if (listeners.size === 0) {
            stop?.();
            stop = null;
        }
    };
}

// The stream and /api/games may disagree on whether ids are strings or numbers.
function lookup<T>(map: Map<string | number, T>, id: string | number) {
    return map.get(id) ?? map.get(String(id)) ?? map.get(Number(id));
}

export function get_odds(
    map: OddsState,
    id: string | number,
): OddsMap | undefined {
    return lookup(map, id);
}

// Odds for one market: { orange, blue } (or combo keys for accumulators).
export function useGameOdds(id: string | number) {
    return useSyncExternalStore(subscribe, () => lookup(known, id));
}

// Odds for every market we have seen. Use with get_odds(map, id).
export function useAllOdds() {
    return useSyncExternalStore(subscribe, () => known);
}

// Only markets that are live right now (no locked ones).
export function useLiveOdds() {
    return useSyncExternalStore(subscribe, () => live);
}

// Per-leg 80/20 split for an accumulator:
// [{ game_id, orange, blue, orange_percent, passed }]
export function useAccumulatorLegs(id: string | number): OddsLeg[] | undefined {
    return useSyncExternalStore(subscribe, () => lookup(known_legs, id));
}

