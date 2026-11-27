import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Get_Slip_Bets, Place_Bet, Place_Multi_Bet } from "../api/bet-api";
import { useAuth } from "../store/auth-store";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import PopUpModal from "./popup-modal";
import { useFetchBets } from "../hooks/useFetchBets";
import { useHistoryStore } from "../store/history";
import { Side } from "../pages/home/Accumulator.utils";

interface Prop {
    choosenBet: {
        game_id: string;
        team: string;
    };
    choosenAccumulatorBet: {
        game_id: string;
        combo: string[];
    };
    setChoosenAccumulatorBet: Dispatch<
        SetStateAction<{
            game_id: string;
            combo: string[];
        }>
    >;
    matchType: "SINGLE" | "MULTI";
    setMatchType: Dispatch<SetStateAction<"SINGLE" | "MULTI">>;
    betAmount: number;
    setBetAmount: (value: number) => void;
}

export default function BetWidget({
    choosenBet,
    choosenAccumulatorBet,
    setChoosenAccumulatorBet,
    betAmount,
    matchType,
    setMatchType,
    setBetAmount,
}: Prop) {
    const suggested_amount = [200, 500, 1000, 5000, 10000];
    const [slipCode, setSlipCode] = useState<string>();
    const [code, setCode] = useState<string>("");
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

    const [serach, setSearch] = useState(false);

    const { data: betslip, error: betSlipError } = useQuery({
        queryKey: ["get_bets_from_slip"],
        queryFn: () => Get_Slip_Bets(code!),
        enabled: serach,
    });

    useEffect(() => {
        if (!logs) return;
        if (betslip) {
            console.log(betslip);
            if (betslip.data.accumulator_bets[0].status !== "placed") {
                setStatus("ERROR");
                setMsg("BET IS NOT OPEN");
                setShow(true);
                setSearch(false);
                return;
            }
            setChoosenAccumulatorBet({
                game_id: betslip.data.accumulator_bets[0].accumulator_id,
                combo: from_combo_string(
                    betslip.data.accumulator_bets[0].combo,
                ),
            });
            setSearch(false);
        }
        if (betSlipError) {
            console.log(betSlipError);
            setSearch(false);
        }
    }, [betslip, betSlipError, logs]);

    const { mutate: placeSingleBet, isPending: isPlacingSingle } = useMutation({
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
                setSlipCode(undefined);
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
                setMsg("INVALID BET");
            } else if (statusCode === 409) {
                setMsg("BET IS NOT OPEN");
            } else if (statusCode === 402) {
                setMsg("INSUFFICIENT BALANCE");
            } else {
                setMsg("ERROR PLACING BET");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });

    const { mutate: placeMultiBet, isPending: isPlacingMulti } = useMutation({
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
                setSlipCode(data.data?.slip_code);
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
                setMsg("INVALID BET");
            } else if (statusCode === 409) {
                setMsg("BET IS NOT OPEN");
            } else if (statusCode === 402) {
                setMsg("INSUFFICIENT BALANCE");
            } else {
                setMsg("ERROR PLACING BET");
            }

            setStatus("ERROR");
            setShow(true);
        },
    });
    // True while any bet request is in flight; used to block double clicks.
    const isPlacing = isPlacingSingle || isPlacingMulti;

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
        if (!logs || isPlacing) return; // ignore clicks while a bet is in flight
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
    }, [
        logs,
        matchType,
        choosenAccumulatorBet,
        choosenBet,
        betAmount,
        isPlacing,
    ]);
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
            <div className="flex items-center gap-4">
                <input
                    className="border border-[#ffb800]/50 w-full p-2 rounded-lg placeholder-white/70"
                    type="text"
                    placeholder="Input Slip Code ..."
                    name=""
                    id=""
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button
                    onClick={() => {
                        setMatchType("MULTI");
                        setSearch(true);
                        setCode("");
                    }}
                    className="p-2 bg-[#ffb800] rounded-lg text-[#530237] font-bold"
                >
                    Submit
                </button>
            </div>

            <button
                onClick={handleBet}
                disabled={isPlacing}
                className="w-full py-2 border border-white rounded-md bg-gradient-to-b from-[#FDC94B] to-[#F9B92D] shadow-[0_4px_0_#F9B92D,0_0_20px_rgba(0,120,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isPlacing ? "PLACING..." : "BET"}
            </button>
            {show && (
                <PopUpModal
                    text={msg}
                    type={status}
                    setShow={setShow}
                    slipCode={slipCode}
                />
            )}
        </div>
    );
}

function formatNumber(num: number) {
    if (num >= 1000) {
        return `${num / 1000}k`;
    }

    return num.toString();
}

const LETTER_SIDE: Record<string, Side> = { O: "orange", B: "blue" };

// "OBO" -> ["orange", "blue", "orange"]
// Returns [] if the string has anything other than O or B.
export function from_combo_string(combo: string): Side[] {
    const sides = combo
        .trim()
        .toUpperCase()
        .split("")
        .map((c) => LETTER_SIDE[c]);

    return sides.every(Boolean) ? sides : [];
}

