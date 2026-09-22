import { create } from "zustand";

export type bet = {
    amount: number;
    createdtime: string;
    game_id: string;
    id: string;
    payout: number;
    slip_code: string;
    status: string;
    team: string;
};

type bet_history = {
    total_staked: number;
    net_profiit: number;
    bets: bet[];
    setBets: (bets: bet[]) => void;
    setStats: (stats: { total_staked: number; net_profiit: number }) => void;
};

export const useHistoryStore = create<bet_history>((set, get) => ({
    total_staked: 0,
    net_profiit: 0,
    bets: [],
    setBets: (bets) => {
        const { totalStaked, netProfitLoss } = calculateBetStats(bets);
        get().setStats({
            total_staked: totalStaked,
            net_profiit: netProfitLoss,
        });
        set({ bets });
    },
    setStats: (stats) => {
        set({
            total_staked: stats.total_staked,
            net_profiit: stats.net_profiit,
        });
    },
}));

function calculateBetStats(bets: bet[]) {
    return bets.reduce(
        (acc, currentBet) => {
            // 1. Accumulate total staked money
            acc.totalStaked += currentBet.amount;

            // 2. Calculate net profit or loss based on status
            if (currentBet.status === "won") {
                // Profit is total payout minus what you originally put down
                acc.netProfitLoss += currentBet.payout - currentBet.amount;
            } else if (currentBet.status === "lost") {
                // Loss reduces your net balance by the staked amount
                acc.netProfitLoss -= currentBet.amount;
            }
            // 'placed' and 'refunded' contribute 0 change to profit/loss

            return acc;
        },
        { totalStaked: 0, netProfitLoss: 0 },
    );
}

