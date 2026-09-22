import { create } from "zustand";

type wallet = {
    balance: 0;
    withdrawal_account: {
        account_name: "";
        bank_name: "";
        account_number: "";
    };
};

type wallet_type = {
    wallet: wallet | null;
    setWallet: (wallet: wallet) => void;
};

export const useWalletStore = create<wallet_type>((set) => ({
    wallet: null,
    setWallet: (wallet) => set({ wallet }),
}));
