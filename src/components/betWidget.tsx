import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Place_Bet, Place_Multi_Bet } from "../api/bet-api";
import { useAuth } from "../store/auth-store";
import { useCallback, useEffect, useState } from "react";
import PopUpModal from "./popup-modal";
import { useFetchBets } from "../hooks/useFetchBets";
import { useHistoryStore } from "../store/history";

interface Prop {
    choosenBet: {
        game_id: string;
        team: string;
    };
    choosenAccumulatorBet: {
        game_id: string;
        combo: string[];
    };
    matchType: "SINGLE" | "MULTI";
    betAmount: number;
    setBetAmount: (value: number) => void;
}

export default function BetWidget({
    choosenBet,
    choosenAccumulatorBet,
    betAmount,
    matchType,
    setBetAmount,
}: Prop) {
    const suggested_amount = [200, 500, 1000, 5000, 10000];
    const logs = useAuth((s) => s.login_result);
    const refetch = useHistoryStore((s) => s.refetch);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");
    const { getBetHistory, getAccumulatorBetHistory } = useFetchBets();
    const queryClient = useQueryClient();

    // A placed bet takes the stake out of the wallet, so re-run the wallet
    // query that App.tsx keeps in the wallet store; the header balance updates
    // when it finishes.
    const refreshBalance = () => {
        queryClient.invalidateQueries({ queryKey: ["get_wallet_info"] });
    };

    const { mutate: placeSingleBet } = useMutation({
        mutationKey: ["place_bet_single"],
        mutationFn: (token: string) =>
            Place_Bet(token, {
                game_id: choosenBet.game_id,
                team: choosenBet.team,
                amount: betAmount,
            }),
        onSuccess: (data) => {
            // If your API function returns the response object containing status
            if (data?.status === 200 || data?.status === 201) {
                setMsg("BET PLACED SUCCESSFULLY");
                setStatus("SUCCESS");
                setShow(true);
                getBetHistory();
                refreshBalance();
            }
            console.log(data);
        },
        onError: (err: any) => {
            console.error(err);

            // Extract status from Axios error or custom thrown error
            const statusCode = err.response?.status || err.status;

            if (statusCode === 400) {
                setMsg("INSUFFICIENT BALANCE OR INVALID BET");
            } else if (statusCode === 409) {
                setMsg("BET IS NOT OPEN");
            } else {
                setMsg("ERROR PLACING BET");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });

    const { mutate: placeMultiBet } = useMutation({
        mutationKey: ["place_bet_multi"],
        mutationFn: (data: {
            token: string;
            accumulator_id: string;
            combo: string;
            amount: number;
        }) =>
            Place_Multi_Bet(data.token, {
                accumulator_id: data.accumulator_id,
                combo: data.combo,
                amount: data.amount,
            }),
        onSuccess: (data) => {
            // If your API function returns the response object containing status
            if (data?.status === 200 || data?.status === 201) {
                setMsg("BET PLACED SUCCESSFULLY");
                setStatus("SUCCESS");
                setShow(true);
                getAccumulatorBetHistory();
                refreshBalance();
            }
            console.log(data);
        },
        onError: (err: any) => {
            console.error(err);

            // Extract status from Axios error or custom thrown error
            const statusCode = err.response?.status || err.status;

            if (statusCode === 400) {
                setMsg("INSUFFICIENT BALANCE OR INVALID BET");
            } else if (statusCode === 409) {
                setMsg("BET IS NOT OPEN");
            } else {
                setMsg("ERROR PLACING BET");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });
    useEffect(() => {
        getBetHistory();
    }, [refetch]);
    // 💡 You can now delete the entire useEffect hook!
    const formaMultiBetPayload = () => {
        if (!choosenAccumulatorBet) return;
        const comboArray = choosenAccumulatorBet.combo.map((team) =>
            team.charAt(0).toUpperCase(),
        );
        const combo = comboArray.join("");
        console.log("Formatted Multi Bet Payload : ", {
            accumulator_id: choosenAccumulatorBet.game_id,
            combo: combo,
            amount: betAmount,
        });
        return {
            accumulator_id: choosenAccumulatorBet.game_id,
            combo: combo,
            amount: betAmount,
        };
    };

    const handleBet = useCallback(() => {
        if (!logs) return;
        if (matchType === "MULTI") {
            console.log("Placing Multi Bet : ", choosenAccumulatorBet);
            const multiBetPayload = formaMultiBetPayload();
            placeMultiBet({
                token: logs.token,
                accumulator_id: multiBetPayload?.accumulator_id || "",
                combo: multiBetPayload?.combo || "",
                amount: multiBetPayload?.amount || 0,
            });
            // Call your multi bet API function here
            // placeMultiBet(logs.token, choosenAccumulatorBet);

            // placeMultiBet(logs.token, choosenAccumulatorBet);
        } else {
            placeSingleBet(logs.token);
        }
    }, [logs, matchType, choosenAccumulatorBet, choosenBet, betAmount]);
    return (
        <div className="flex shrink-0 flex-col gap-2 rounded-lg border border-[#FDC94B] bg-[#2e071b] p-2 shadow-lg shadow-black">
            <div className="grid w-full grid-cols-5 gap-1 p-1 sm:gap-2 sm:p-2">
                {suggested_amount.map((amount, i) => (
                    <button
                        key={i}
                        onClick={() => setBetAmount(amount)}
                        className={`min-w-0 whitespace-nowrap rounded-md py-1 text-xs font-bold sm:text-sm ${amount === betAmount ? "bg-gradient-to-b from-[#4BD97A] to-[#2DA84E] " : "bg-gradient-to-b from-[#ffb800] to-[#F9B92D] border-b-4 border-b-[#B88A27]"} `}
                    >
                        ₦ {formatNumber(amount)}
                    </button>
                ))}
            </div>

            <input
                type="number"
                value={betAmount}
                onChange={(e) => {
                    setBetAmount(Number(e.target.value));
                }}
                className="w-full min-w-0 rounded-lg border bg-[#030b11] p-2 text-[#FDC94B]"
            />

            <button
                onClick={handleBet}
                className="w-full py-2 border border-white rounded-md bg-gradient-to-b from-[#FDC94B] to-[#F9B92D] shadow-[0_4px_0_#F9B92D,0_0_20px_rgba(0,120,255,0.6)]"
            >
                BET
            </button>
            {show && <PopUpModal text={msg} type={status} setShow={setShow} />}
        </div>
    );
}

function formatNumber(num: number) {
    if (num >= 1000) {
        return `${num / 1000}k`;
    }

    return num.toString();
}
