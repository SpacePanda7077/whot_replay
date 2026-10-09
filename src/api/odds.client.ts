import { ENDPOINT } from "./glogal-api";

type OddsMap = Record<string, number>; // { orange, blue } or { OB, OO, ... }

// Accumulator messages also carry the split of that accumulator's own tickets
// on each leg. `passed` is the 80/20 verdict for the leg.
export type OddsLeg = {
    game_id: string;
    orange: number;
    blue: number;
    orange_percent: number;
    passed: boolean;
};

type OddsEntry = { id: string | number; odds: OddsMap; legs?: OddsLeg[] };

export type OddsState = Map<string | number, OddsMap>;
export type LegsState = Map<string | number, OddsLeg[]>;

type Options = {
    base_url?: string;
    // Called when a market locks or settles (the stream sends `closed`).
    on_closed?: (id: string | number) => void;
};

export function connect_odds(
    on_change: (odds: OddsState, legs: LegsState) => void,
    { base_url = "/api", on_closed }: Options = {},
) {
    const state: OddsState = new Map();
    const legs_state: LegsState = new Map();
    const es = new EventSource(`${ENDPOINT}/api/odds`);

    const emit = () => on_change(new Map(state), new Map(legs_state));

    const put = ({ id, odds, legs }: OddsEntry) => {
        state.set(id, odds);
        if (legs) legs_state.set(id, legs);
    };

    // Full picture on connect (and again after every auto-reconnect),
    // so replace the state instead of merging into it.
    es.addEventListener("snapshot", (e) => {
        const list: OddsEntry[] = JSON.parse((e as MessageEvent).data);
        state.clear();
        legs_state.clear();
        for (const entry of list) put(entry);
        emit();
    });

    // One update per accepted bet.
    es.addEventListener("odds", (e) => {
        put(JSON.parse((e as MessageEvent).data));
        emit();
    });

    // Market locked or settled: stop showing live odds for it.
    es.addEventListener("closed", (e) => {
        const { id } = JSON.parse((e as MessageEvent).data);
        state.delete(id);
        legs_state.delete(id);
        emit();
        on_closed?.(id);
    });

    es.onerror = () => {
        // EventSource reconnects by itself; a fresh snapshot will follow.
        console.warn("odds stream interrupted, reconnecting...");
    };

    return () => es.close(); // call on unmount
}

