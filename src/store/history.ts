import { create } from "zustand";

export type bet = {
    amount: number;
    createdtime: string;
    id: string;
    payout: number;
    slip_code: string;
    status: string;
    f_status: "placed" | "in match" | "settled";
    // Single bets (GET /api/bets)
    game_id?: string;
    team?: string;
    // Accumulator bets (GET /api/accumulators/bets)
    accumulator_id?: string;
    combo?: string;
};

type bet_history = {
    total_staked: number;
    net_profiit: number;
    refetch: number;
    bets: bet[];
    setBets: (bets: bet[]) => void;
    setStats: (stats: { total_staked: number; net_profiit: number }) => void;
    setRefetch: (refetch: number) => void;
};

export const is_accumulator = (b: bet) => !!b.combo || !!b.accumulator_id;

// Singles and accumulators come from different collections, so ids can
// overlap. Use this for React keys.
export const bet_key = (b: bet) =>
    `${is_accumulator(b) ? "acc" : "single"}-${b.id}`;

export const useHistoryStore = create<bet_history>((set, get) => ({
    total_staked: 0,
    net_profiit: 0,
    refetch: 0,
    bets: [],
    setBets: (bets) => {
        // Newest first, so merged singles + accumulators stay in order.
        const sorted = [...bets].sort(
            (a, b) =>
                new Date(b.createdtime).getTime() -
                new Date(a.createdtime).getTime(),
        );
        const { totalStaked, netProfitLoss } = calculateBetStats(sorted);
        get().setStats({
            total_staked: totalStaked,
            net_profiit: netProfitLoss,
        });
        set({ bets: sorted });
    },
    setStats: (stats) => {
        set({
            total_staked: stats.total_staked,
            net_profiit: stats.net_profiit,
        });
    },
    setRefetch: (refetch) => set({ refetch }),
}));

export function calculateBetStats(bets: bet[]) {
    return bets.reduce(
        (acc, currentBet) => {
            acc.totalStaked += currentBet.amount;

            if (currentBet.status === "won") {
                // Profit is total payout minus what you originally put down
                acc.netProfitLoss += currentBet.payout - currentBet.amount;
            } else if (currentBet.status === "lost") {
                acc.netProfitLoss -= currentBet.amount;
            }
            // 'placed' and 'refunded' contribute 0 change to profit/loss

            return acc;
        },
        { totalStaked: 0, netProfitLoss: 0 },
    );
}
