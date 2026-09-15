import { create } from "zustand";
type upcoming_replay = {
    id: string;
    teams: { team: string; name: string; odds: number }[];
};

type live_replay = {
    id: string;
    teams: [{ name: string; odds: number }, { name: string; odds: number }];
};

type replays = {
    live: live_replay | null;
    upcoming_replay: upcoming_replay[];
    setUpcomingReplay: (u_repaly: upcoming_replay[]) => void;
};

export const useReplayStore = create<replays>((set) => ({
    live: null,
    upcoming_replay: [],
    setUpcomingReplay: (replays) => set({ upcoming_replay: replays }),
}));

export const dummy_replay = [
    {
        id: "hdhddhdhhd",
        teams: [
            { team: "orange", name: "adamu", odds: 1.3 },
            { team: "blue", name: "esther", odds: 1.5 },
        ],
    },
    {
        id: "hdhddhdhhd1",
        teams: [
            { team: "orange", name: "adamu", odds: 1.3 },
            { team: "blue", name: "esther", odds: 1.5 },
        ],
    },
    {
        id: "hdhddhdhhd2",
        teams: [
            { team: "orange", name: "adamu", odds: 1.3 },
            { team: "blue", name: "esther", odds: 1.5 },
        ],
    },
];

