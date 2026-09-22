import { useMutation } from "@tanstack/react-query";
import { Place_Bet } from "../api/bet-api";
import { useAuth } from "../store/auth-store";
import { useCallback, useEffect, useState } from "react";
import PopUpModal from "./popup-modal";

interface Prop {
    choosenBet: {
        game_id: string;
        team: string;
    };
    betAmount: number;
    setBetAmount: (value: number) => void;
}

export default function BetWidget({
    choosenBet,
    betAmount,
    setBetAmount,
}: Prop) {
    const suggested_amount = [200, 500, 1000, 5000, 10000];
    const logs = useAuth((s) => s.login_result);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");
    const { mutate } = useMutation({
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

    // 💡 You can now delete the entire useEffect hook!

    const handleBet = useCallback(() => {
        if (!logs) return;
        mutate(logs.token);
    }, [logs]);
    return (
        <div className="bg-[#2e071b] p-2 rounded-lg border border-[#FDC94B] shadow-lg shadow-black flex flex-col gap-2">
            <div className="w-full flex items-end justify-between gap-2 p-2">
                {suggested_amount.map((amount, i) => (
                    <button
                        key={i}
                        onClick={() => setBetAmount(amount)}
                        className={`w-full py-1 font-bold rounded-md ${amount === betAmount ? "bg-gradient-to-b from-[#4BD97A] to-[#2DA84E] " : "bg-gradient-to-b from-[#ffb800] to-[#F9B92D] border-b-4 border-b-[#B88A27]"} `}
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
                className={`w-full border  rounded-lg p-2 bg-[#030b11] text-[#FDC94B]`}
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

