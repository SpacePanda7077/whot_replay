import { create } from "zustand";
import { useReplayStore } from "./replay.store";

type odds = {
    id: string;
    team: string;
};
type accumulator_type = {
    total_odds: number;
    accumulated_odds: odds[];
    add_odds: (odd: odds) => void;
    remove_odds: (odd: odds) => void;
    calculate_total_odds: () => void;
};

export const useAccumulatedOddStore = create<accumulator_type>((set, get) => ({
    total_odds: 0,
    accumulated_odds: [],
    add_odds: (odd) => {
        const accumulated_odds = get().accumulated_odds;

        const odd_exist = accumulated_odds.find((odds) => odds.id === odd.id);

        if (odd_exist) {
            if (odd_exist.team === odd.team) {
                // Same match, same team clicked again — remove it
                const updated_odds = accumulated_odds.filter(
                    (odds) => odds.id !== odd.id,
                );
                set({ accumulated_odds: updated_odds });
                return;
            }

            // Same match, different team selected — swap it
            const updated_odds = accumulated_odds.map((odds) =>
                odds.id === odd.id ? odd : odds,
            );
            set({ accumulated_odds: updated_odds });
            return;
        }

        const updated_odds = [...accumulated_odds, odd];
        set({ accumulated_odds: updated_odds });
    },
    remove_odds: (odd) => {
        const accumulated_odds = get().accumulated_odds;

        const odd_index = accumulated_odds.findIndex(
            (odds) => odds.id === odd.id,
        );
        if (odd_index === -1) return;
        const updated_odds = accumulated_odds.splice(odd_index, 1);

        set({ accumulated_odds: updated_odds });
    },
    calculate_total_odds: () => {
        const accumulated_odds = get().accumulated_odds;
        const upcoming_replay = useReplayStore.getState().upcoming_replay;

        if (accumulated_odds.length === 0) {
            set({ total_odds: 0 });
            return;
        }

        // Multiply all selected match odds together
        const total = accumulated_odds.reduce((acc, selected) => {
            // 1. Find the matching match in the replay store
            const match = upcoming_replay.find(
                (replay) => replay.id === selected.id,
            );
            if (!match) return acc;

            // 2. Find the selected team inside that match
            const teamData = match.teams.find((t) => t.team === selected.team);

            // 3. Multiply accumulated odds by the team's odds
            return teamData ? acc * teamData.odds : acc;
        }, 1);

        // Round to 2 decimal places to avoid standard JS floating point errors (e.g., 2.399999999)
        set({ total_odds: Number(total.toFixed(2)) });
    },
}));

