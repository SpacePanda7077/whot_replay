import { useQuery } from "@tanstack/react-query";
import Header from "../../components/header/Header";
import DepositDashboard from "./deposit-dashboard";
import TransactionHistory from "./transaction-history";
import WalletDashboard from "./wallet-dashboard";
import { GetWallet } from "../../api/wallet-api";
import { useAuth } from "../../store/auth-store";
import { useEffect } from "react";
import { useWalletStore } from "../../store/wallet-store";

export default function Wallet() {
    const logs = useAuth((s) => s.login_result);
    const setwallet = useWalletStore((s) => s.setWallet);
    const { data: walletdata, error: walletError } = useQuery({
        queryKey: ["get_wallet_info"],
        queryFn: () => GetWallet(logs!.token),
        enabled: logs !== null,
    });

    useEffect(() => {
        if (walletdata) {
            console.log(walletdata);
            setwallet(walletdata.data);
        }
        if (walletError) {
            console.log(walletError);
        }
    }, [walletdata, walletError]);
    return (
        <>
            <Header />
            <div className="flex flex-col gap-4 items-center justify-center mt-30 text-white/70 ">
                <WalletDashboard />

                <TransactionHistory />
            </div>
        </>
    );
}

