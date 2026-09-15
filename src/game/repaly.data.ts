export type GameReplayStatus = "recording" | "completed" | "failed";

export interface IGameReplayPlayer {
    player_index: number;
    userid: string;
    full_name: string;
    avatar: string;
}

export interface Card_Info {
    shape: string;
    number: number;
}

export interface IGameReplayEvent {
    seq: number;
    type: string;
    payload: any;
    createdtime: Date;
}

export interface IGameReplay {
    id: string;
    room_number: string;
    game_mode: number;
    tournament_level: number;
    bet_amount: number;
    player_count: number;

    players: IGameReplayPlayer[];
    turn_array: number[];

    initial_hands: Card_Info[][];
    initial_last_card: Card_Info;
    initial_deck: Card_Info[];

    events: IGameReplayEvent[];

    final_hands: Card_Info[][];

    winner_player_index: number;
    winneruserid: string;

    startedtime: Date;
    endedtime: Date;

    status: GameReplayStatus;

    createdtime: Date;
    updatedtime: Date;
}

export const replay: IGameReplay = {
    id: "replay_001",
    room_number: "ROOM-48291",
    game_mode: 2,
    tournament_level: 1,
    bet_amount: 100,
    player_count: 2,

    players: [
        {
            player_index: 0,
            userid: "user_alice",
            full_name: "Alice",
            avatar: "https://example.com/avatar/alice.png",
        },
        {
            player_index: 1,
            userid: "user_bob",
            full_name: "Bob",
            avatar: "https://example.com/avatar/bob.png",
        },
    ],

    turn_array: [0, 1],

    initial_hands: [
        // Alice
        [
            { shape: "circle", number: 8 },
            { shape: "triangle", number: 2 },
            { shape: "cross", number: 14 }, // Hold On
            { shape: "square", number: 5 },
            { shape: "star", number: 20 }, // Market
            { shape: "whot", number: 20 },
        ],

        // Bob
        [
            { shape: "circle", number: 5 },
            { shape: "triangle", number: 8 },
            { shape: "square", number: 2 },
            { shape: "cross", number: 1 },
            { shape: "circle", number: 14 },
            { shape: "star", number: 10 },
        ],
    ],

    initial_last_card: {
        shape: "circle",
        number: 1,
    },

    initial_deck: [
        { shape: "square", number: 8 },
        { shape: "triangle", number: 5 },
        { shape: "circle", number: 10 },
        { shape: "cross", number: 2 },
        { shape: "star", number: 1 },
        { shape: "whot", number: 20 },
        { shape: "circle", number: 11 },
        { shape: "square", number: 14 },
        { shape: "cross", number: 5 },
        { shape: "triangle", number: 10 },
        { shape: "whot", number: 20 },
    ],

    events: [
        {
            seq: 1,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "circle", number: 8 },
            },
            createdtime: new Date("2026-07-24T10:00:00Z"),
        },

        {
            seq: 2,
            type: "play_card",
            payload: {
                player: 1,
                card: { shape: "triangle", number: 8 },
            },
            createdtime: new Date("2026-07-24T10:00:03Z"),
        },

        {
            seq: 3,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "triangle", number: 2 },
            },
            createdtime: new Date("2026-07-24T10:00:08Z"),
        },

        {
            seq: 4,
            type: "pick_two",
            payload: {
                player: 1,
                card: { shape: "square", number: 2 },
                target: 0,
            },
            createdtime: new Date("2026-07-24T10:00:15Z"),
        },

        {
            seq: 5,
            type: "draw_cards",
            payload: {
                player: 0,
                count: 2,
                cards: [
                    { shape: "square", number: 8 },
                    { shape: "triangle", number: 5 },
                ],
            },
            createdtime: new Date("2026-07-24T10:00:18Z"),
        },

        {
            seq: 6,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "cross", number: 14 },
            },
            createdtime: new Date("2026-07-24T10:00:30Z"),
        },

        {
            seq: 7,
            type: "hold_on",
            payload: {
                player: 0,
            },
            createdtime: new Date("2026-07-24T10:00:30Z"),
        },

        {
            seq: 8,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "star", number: 20 },
            },
            createdtime: new Date("2026-07-24T10:00:35Z"),
        },

        {
            seq: 9,
            type: "general_market",
            payload: {
                affectedPlayers: [1],
                cards: [
                    {
                        player: 1,
                        card: { shape: "circle", number: 10 },
                    },
                ],
            },
            createdtime: new Date("2026-07-24T10:00:36Z"),
        },

        {
            seq: 10,
            type: "play_card",
            payload: {
                player: 1,
                card: { shape: "star", number: 10 },
            },
            createdtime: new Date("2026-07-24T10:00:50Z"),
        },

        {
            seq: 11,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "whot", number: 20 },
                requestedShape: "circle",
            },
            createdtime: new Date("2026-07-24T10:01:00Z"),
        },

        {
            seq: 12,
            type: "play_card",
            payload: {
                player: 1,
                card: { shape: "circle", number: 5 },
            },
            createdtime: new Date("2026-07-24T10:01:10Z"),
        },

        {
            seq: 13,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "square", number: 5 },
            },
            createdtime: new Date("2026-07-24T10:01:20Z"),
        },

        {
            seq: 14,
            type: "draw_card",
            payload: {
                player: 1,
                card: { shape: "triangle", number: 20 },
            },
            createdtime: new Date("2026-07-24T10:01:35Z"),
        },

        {
            seq: 15,
            type: "play_card",
            payload: {
                player: 0,
                card: { shape: "triangle", number: 5 },
            },
            createdtime: new Date("2026-07-24T10:01:45Z"),
        },

        {
            seq: 16,
            type: "game_over",
            payload: {
                winner: 0,
                reason: "no_cards_left",
            },
            createdtime: new Date("2026-07-24T10:01:50Z"),
        },
    ],

    final_hands: [
        [],

        [
            { shape: "cross", number: 1 },
            { shape: "circle", number: 14 },
            { shape: "circle", number: 10 },
            { shape: "triangle", number: 20 },
        ],
    ],

    winner_player_index: 0,
    winneruserid: "user_alice",

    startedtime: new Date("2026-07-24T10:00:00Z"),
    endedtime: new Date("2026-07-24T10:01:50Z"),

    status: "completed",

    createdtime: new Date(),
    updatedtime: new Date(),
};

