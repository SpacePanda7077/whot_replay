import { create } from "zustand";

export type Players = [
    {
        player_index: 0;
        userid: string;
        full_name: string;
        avatar: string;
        team: string;
    },
    {
        player_index: 1;
        userid: string;
        full_name: string;
        avatar: string;
        team: string;
    },
];

export type replay = {
    id: string;
    status: string;
    bets_open_at: string;
    bets_lock_at: string;
    starts_at: string;
    ends_at: string;
    players: Players;
};

export type accumulator = {
    id: string;
    status: string;
    legs: { game_id: string; players: Players }[];
    total_pool: number;
    combo_pools: Record<string, number>;
    combo_stakers: Record<string, number>;
    fee_percent: number;
    cap_percent: number;
    createdtime: string;
};

type replays = {
    watchIndex: number;
    live_replay: replay[];
    replays: replay[];
    // Games whose stream finished (SSE "end"). Authoritative, never reused.
    ended: Record<string, true>;
    setLiveReplay: (replay: replay[]) => void;
    accumulator: accumulator[];
    setReplays: (replays: replay[]) => void;
    setAccumulator: (accumulator: accumulator[]) => void;
    setWatchIndex: (index: number) => void;
    markEnded: (game_id: string) => void;
    // Replace every ended live game with another locked game (same slot),
    // and fill empty slots. Safe to call as often as you like.
    syncLiveReplays: () => void;
};

// Slots map to scenes: slot 0 -> Game1, slot 1 -> Game2, slot 2 -> Game3.
export const MAX_LIVE = 3;

// A game counts as over this long after its ends_at, which leaves time for
// the final board to be seen. Assumes ends_at is about the end of the stream.
const END_GRACE_MS = 15_000;

const ended_by_time = (r: replay) => {
    const t = Date.parse(r.ends_at);
    return Number.isFinite(t)
        ? Date.now() >= t + END_GRACE_MS
        : r.status === "settled";
};

export const useReplayStore = create<replays>((set, get) => ({
    watchIndex: 0,
    live_replay: [],
    replays: [],
    ended: {},
    accumulator: [],
    setAccumulator: (accumulator) => set({ accumulator }),
    setLiveReplay: (replay) => set({ live_replay: replay }),
    setReplays: (replays) => set({ replays }),
    setWatchIndex: (index) => set({ watchIndex: index }),

    markEnded: (game_id) =>
        set((s) =>
            s.ended[game_id] ? s : { ended: { ...s.ended, [game_id]: true } },
        ),

    syncLiveReplays: () => {
        const { live_replay, replays, ended } = get();

        const is_ended = (r: replay) => !!ended[r.id] || ended_by_time(r);
        const latest = new Map(replays.map((r) => [r.id, r]));
        const in_use = new Set(live_replay.map((r) => r.id));

        // Replacement candidates: locked, not over, not already in a slot.
        // Soonest start first.
        const pool = replays
            .filter(
                (r) =>
                    r.status === "locked" && !is_ended(r) && !in_use.has(r.id),
            )
            .sort(
                (a, b) =>
                    (Date.parse(a.starts_at) || 0) -
                    (Date.parse(b.starts_at) || 0),
            );

        const next = [...live_replay];
        let changed = false;

        for (let i = 0; i < MAX_LIVE; i++) {
            const current = next[i];

            if (current) {
                const fresh = latest.get(current.id);
                // Missing from a non-empty fresh list means the server
                // dropped it (settled), so treat it as over.
                const over = fresh
                    ? is_ended(fresh)
                    : !!ended[current.id] || replays.length > 0;
                if (!over) continue;
            }

            const replacement = pool.shift();
            if (!replacement) continue; // nothing to swap in: keep the slot
            next[i] = replacement;
            changed = true;
        }

        if (changed) set({ live_replay: next.filter(Boolean) });
    },
}));

//=========================================================================//
//=========================== DUMMY DATA ==================================//
//=========================================================================//

const make_players = (): Players => [
    {
        player_index: 0,
        userid: "u1",
        full_name: "",
        avatar: "default",
        team: "orange",
    },
    {
        player_index: 1,
        userid: "u2",
        full_name: "",
        avatar: "default",
        team: "blue",
    },
];

const make_replay = (id: string): replay => ({
    id,
    status: "open",
    bets_open_at: "2026-09-10T09:57:00Z",
    bets_lock_at: "2026-09-10T09:59:00Z",
    starts_at: "2026-09-10T12:00:00Z",
    ends_at: "2026-09-10T12:02:00Z",
    players: make_players(),
});

export const dummy_replay: replay[] = [
    make_replay("room-number"),
    make_replay("room-number1"),
    make_replay("room-number2"),
];

const make_accumulator = (id: string): accumulator => ({
    id,
    status: "open",
    legs: [
        { game_id: "room-1", players: make_players() },
        { game_id: "room-2", players: make_players() },
    ],
    total_pool: 0,
    combo_pools: { OO: 0, OB: 0, BO: 0, BB: 0 },
    combo_stakers: { OO: 0, OB: 0, BO: 0, BB: 0 },
    fee_percent: 10,
    cap_percent: 80,
    createdtime: "2026-09-10T12:00:00Z",
});

export const duumy_accumulator: accumulator[] = [
    make_accumulator("66b123456789012345678901"),
    make_accumulator("66b1234567890123456i78901"),
];
