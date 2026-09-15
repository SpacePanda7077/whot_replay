import Header from "../../components/header/Header";
import DepositDashboard from "./deposit-dashboard";
import TransactionHistory from "./transaction-history";
import WalletDashboard from "./wallet-dashboard";

export default function Wallet() {
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

