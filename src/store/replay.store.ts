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
type replay = {
    id: string;
    status: string;
    bets_open_at: string;
    bets_lock_at: string;
    starts_at: string;
    ends_at: string;
    players: Players;
};
type accumulator = {
    id: string;
    status: string;
    legs: [
        { game_id: "room-1"; players: Players },
        { game_id: "room-2"; players: Players },
    ];
    total_pool: number;
    combo_pools: any;
    combo_stakers: any;
    fee_percent: number;
    cap_percent: number;
    createdtime: string;
};
type replays = {
    live_replay: replay | null;
    replays: replay[];
    setLiveReplay: (replay: replay) => void;
    setReplays: (replays: replay[]) => void;
};

export const useReplayStore = create<replays>((set) => ({
    live_replay: null,
    replays: [],
    setLiveReplay: (replay) => set({ live_replay: replay }),
    setReplays: (replays) => set({ replays }),
}));

export const dummy_replay: replay[] = [
    {
        id: "room-number",
        status: "open",
        bets_open_at: "2026-09-10T09:57:00Z",
        bets_lock_at: "2026-09-10T09:59:00Z",
        starts_at: "2026-09-10T12:00:00Z",
        ends_at: "2026-09-10T12:02:00Z",
        players: [
            {
                player_index: 0,
                userid: "u1",
                full_name: "Ada",
                avatar: "default",
                team: "orange",
            },
            {
                player_index: 1,
                userid: "u2",
                full_name: "Bola",
                avatar: "default",
                team: "blue",
            },
        ],
    },
    {
        id: "room-number1",
        status: "open",
        bets_open_at: "2026-09-10T09:57:00Z",
        bets_lock_at: "2026-09-10T09:59:00Z",
        starts_at: "2026-09-10T12:00:00Z",
        ends_at: "2026-09-10T12:02:00Z",
        players: [
            {
                player_index: 0,
                userid: "u1",
                full_name: "Ada",
                avatar: "default",
                team: "orange",
            },
            {
                player_index: 1,
                userid: "u2",
                full_name: "Bola",
                avatar: "default",
                team: "blue",
            },
        ],
    },
    {
        id: "room-number2",
        status: "open",
        bets_open_at: "2026-09-10T09:57:00Z",
        bets_lock_at: "2026-09-10T09:59:00Z",
        starts_at: "2026-09-10T12:00:00Z",
        ends_at: "2026-09-10T12:02:00Z",
        players: [
            {
                player_index: 0,
                userid: "u1",
                full_name: "Ada",
                avatar: "default",
                team: "orange",
            },
            {
                player_index: 1,
                userid: "u2",
                full_name: "Bola",
                avatar: "default",
                team: "blue",
            },
        ],
    },
];

export const duumy_accumulator: accumulator[] = [
    {
        id: "66b123456789012345678901",
        status: "open",
        legs: [
            {
                game_id: "room-1",
                players: [
                    {
                        player_index: 0,
                        userid: "u1",
                        full_name: "Ada",
                        avatar: "default",
                        team: "orange",
                    },
                    {
                        player_index: 1,
                        userid: "u2",
                        full_name: "Bola",
                        avatar: "default",
                        team: "blue",
                    },
                ],
            },
            {
                game_id: "room-2",
                players: [
                    {
                        player_index: 0,
                        userid: "u1",
                        full_name: "Ada",
                        avatar: "default",
                        team: "orange",
                    },
                    {
                        player_index: 1,
                        userid: "u2",
                        full_name: "Bola",
                        avatar: "default",
                        team: "blue",
                    },
                ],
            },
        ],
        total_pool: 0,
        combo_pools: { OO: 0, OB: 0, BO: 0, BB: 0 },
        combo_stakers: { OO: 0, OB: 0, BO: 0, BB: 0 },
        fee_percent: 10,
        cap_percent: 80,
        createdtime: "2026-09-10T12:00:00Z",
    },
    {
        id: "66b1234567890123456i78901",
        status: "open",
        legs: [
            {
                game_id: "room-1",
                players: [
                    {
                        player_index: 0,
                        userid: "u1",
                        full_name: "Ada",
                        avatar: "default",
                        team: "orange",
                    },
                    {
                        player_index: 1,
                        userid: "u2",
                        full_name: "Bola",
                        avatar: "default",
                        team: "blue",
                    },
                ],
            },
            {
                game_id: "room-2",
                players: [
                    {
                        player_index: 0,
                        userid: "u1",
                        full_name: "Ada",
                        avatar: "default",
                        team: "orange",
                    },
                    {
                        player_index: 1,
                        userid: "u2",
                        full_name: "Bola",
                        avatar: "default",
                        team: "blue",
                    },
                ],
            },
        ],
        total_pool: 0,
        combo_pools: { OO: 0, OB: 0, BO: 0, BB: 0 },
        combo_stakers: { OO: 0, OB: 0, BO: 0, BB: 0 },
        fee_percent: 10,
        cap_percent: 80,
        createdtime: "2026-09-10T12:00:00Z",
    },
];

