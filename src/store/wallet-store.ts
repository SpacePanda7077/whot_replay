import { useMemo } from "react";
import { create } from "zustand";

type wallet = {
    balance: number;
    withdrawal_account: {
        account_name: string;
        bank_name: string;
        account_number: string;
    };
};

type txType = {
    type: "deposit" | "withdrawal";
    amount: number;
    status: `pending` | `success` | `failed` | `reverted`;
    createdtime: string;
};

type txTotals = {
    totalDeposit: number;
    totalWithdrawal: number;
};

type tx = {
    tx: txType[];
    setTx: (tx: txType[]) => void;
    getTotals: () => txTotals;
};

type wallet_type = {
    wallet: wallet | null;
    setWallet: (wallet: wallet) => void;
};

// Only successful transactions are counted
export const calculateTotals = (transactions: txType[]): txTotals => {
    return transactions.reduce<txTotals>(
        (acc, t) => {
            if (t.status !== "success") return acc;
            if (t.type === "deposit") acc.totalDeposit += t.amount;
            else acc.totalWithdrawal += t.amount;
            return acc;
        },
        { totalDeposit: 0, totalWithdrawal: 0 },
    );
};

export const useWalletStore = create<wallet_type>((set) => ({
    wallet: null,
    setWallet: (wallet) => set({ wallet }),
}));

export const useGetTransactions = create<tx>((set, get) => ({
    tx: [],
    setTx: (tx) => set({ tx }),
    getTotals: () => calculateTotals(get().tx),
}));

// Reactive hook: recomputes only when transactions change
export const useTransactionTotals = (): txTotals => {
    const tx = useGetTransactions((state) => state.tx);
    return useMemo(() => calculateTotals(tx), [tx]);
};
