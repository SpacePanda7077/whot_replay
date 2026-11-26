import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CiWallet } from "react-icons/ci";
import {
    GoArrowDownLeft,
    GoArrowDownRight,
    GoArrowUpRight,
} from "react-icons/go";
import { MdArrowOutward } from "react-icons/md";
import { Get_Tx } from "../../api/tx-api";
import { useAuth } from "../../store/auth-store";
import { formatTimeAgo } from "../my-stakes/stake-component";

const ITEMS_PER_PAGE = 5;

type txType = {
    type: "deposit" | "withdrawal";
    amount: number;
    status: `pending` | `success` | `failed` | `reverted`;
    createdtime: string;
};

export default function TransactionHistory() {
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
    const [tx, setTx] = useState<txType[]>([]);

    const type: any = {
        deposit: { ICON: <GoArrowUpRight />, color: "34, 197, 94" },
        withdrawal: { ICON: <GoArrowDownLeft />, color: "255, 61, 0" },
    };

    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(tx.length / ITEMS_PER_PAGE));

    const start = (page - 1) * ITEMS_PER_PAGE;
    const paginatedTx = tx.slice(start, start + ITEMS_PER_PAGE);

    const goPrev = () => setPage((p) => Math.max(1, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <>
            <div className="border border-[#FFB800]/20 w-[95vw] md:w-[70vw] lg:w-[50vw] p-2 rounded-lg flex flex-col gap-2 bg-[#2e041d]">
                <h2 className="text-sm text-white">Transaction History</h2>
                <div>
                    {paginatedTx.map((t, i) => (
                        <div
                            key={start + i}
                            className="grid grid-cols-4 gap-2 p-2 border-b border-[#FFB800]/20"
                        >
                            <span className="text-white flex items-center gap-2">
                                <div
                                    style={{
                                        backgroundColor: `rgba(${type[t.type]?.color},0.2)`,
                                        color: `rgba(${type[t.type]?.color},1)`,
                                    }}
                                    className="p-3 rounded-lg flex items-center justify-center"
                                >
                                    {type[t.type]?.ICON}
                                </div>

                                {t.type}
                            </span>
                            <span className="text-white text-center font-bold">
                                ₦{t.amount.toLocaleString()}
                            </span>
                            <span className="flex justify-center text-white/70 p-1 rounded">
                                {formatTimeAgo(t.createdtime)}
                            </span>
                            <span
                                style={{
                                    backgroundColor: getStatusColor(t.status),
                                }}
                                className="flex w-fit justify-end text-white/70 p-1 rounded"
                            >
                                {t.status}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className="bg-[#FFB800] text-black px-4 py-2 rounded-lg hover:bg-[#FFB800]/80 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        previous
                    </button>
                    <span className="text-white/70 text-xs">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={goNext}
                        disabled={page === totalPages}
                        className="bg-[#FFB800] text-black px-4 py-2 rounded-lg hover:bg-[#FFB800]/80 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        next
                    </button>
                </div>
            </div>
        </>
    );
}

function getStatusColor(t: `pending` | `success` | `failed` | `reverted`) {
    if (t === "pending") return "grey";
    if (t === "success") return "green";
    if (t === "failed") return "red";
    return "orange";
}
