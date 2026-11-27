import { CiWallet } from "react-icons/ci";
import DepositDashboard from "./deposit-dashboard";
import {
    useGetTransactions,
    useTransactionTotals,
    useWalletStore,
} from "../../store/wallet-store";
import { useAuth } from "../../store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { Get_Tx } from "../../api/tx-api";
import { useEffect } from "react";
interface Prop {
    refetch: () => void;
    isDepositing?: boolean;
}
export default function WalletDashboard({ refetch, isDepositing }: Prop) {
    const wallet = useWalletStore((s) => s.wallet);
    const setTx = useGetTransactions((s) => s.setTx);
    const { totalDeposit, totalWithdrawal } = useTransactionTotals();

    const logs = useAuth((s) => s.login_result);
    const { data: TxData, error: Txerror } = useQuery({
        queryKey: ["getTxQuery"],
        queryFn: () => Get_Tx(logs?.token!),
        enabled: logs !== null,
    });

    useEffect(() => {
        if (TxData) {
            console.log(TxData);
            setTx(TxData.data.transactions);
        }
        if (Txerror) {
            console.log(Txerror);
        }
    }, [TxData, Txerror]);
    return (
        <>
            <div className="border border-[#FFB800]/20 w-[95vw] md:w-[70vw] lg:w-[50vw] p-2 rounded-lg flex flex-col gap-2 bg-[#2e041d]">
                <div className="flex gap-2">
                    <CiWallet size={24} color="#FFB800" />
                    <h2>Current Balance</h2>
                </div>
                <h1 className="text-white text-3xl font-bold">
                    ₦{wallet?.balance.toLocaleString() || 0}
                </h1>
                <div className="flex item-center gap-4">
                    <p className="text-sm text-white/70">
                        Lifetime deposit:
                        <span className="text-[#44E305] font-bold">
                            {" "}
                            ₦{totalDeposit}
                        </span>
                    </p>
                    <p className="text-sm text-white/70">
                        Lifetime withdraw:
                        <span className=" font-bold text-[#e43604]">
                            {" "}
                            ₦{totalWithdrawal}
                        </span>
                    </p>
                </div>

                <DepositDashboard
                    refetch={refetch}
                    isDepositing={isDepositing}
                />
            </div>
        </>
    );
}
