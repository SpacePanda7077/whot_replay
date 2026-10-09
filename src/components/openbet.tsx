import { ImBin } from "react-icons/im";
import { bet, is_accumulator } from "../store/history";
import { getTimeRemaining } from "../pages/home/UpcomingMatchTopInfo";
import { useReplayStore } from "../store/replay.store";
import { useEffect, useState } from "react";
import { useGameOdds } from "../hooks/useOdds";

interface Prop {
    bet: bet;
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function OpenBet({ bet: b }: Prop) {
    const [locked, setLocked] = useState(false);
    const [closeTime, setCloseTime] = useState({ min: 0, sec: 0 });

    const acc = is_accumulator(b);
    // Odds stream ids/keys: game id + orange|blue, or accumulator id + combo.
    const odds_id = acc ? b.accumulator_id : b.game_id;
    const odds_key = acc ? b.combo : b.team;
    const odds = useGameOdds(odds_id ?? "")?.[odds_key ?? ""];

    // Only single bets have one lock time we can look up from here.
    // An accumulator locks when its first leg starts.
    const time = useReplayStore((s) => s.replays).find(
        (f) => f.id === b.game_id,
    )?.bets_lock_at;

    useEffect(() => {
        if (!time) return;

        const tick = () => {
            const { minutes, seconds } = getTimeRemaining(time);
            setCloseTime({ min: minutes, sec: seconds });
            if (minutes <= 0 && seconds <= 0) setLocked(true);
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [time]);

    const settled = b.status && b.status !== "placed";
    const status_label = settled
        ? b.status.toUpperCase()
        : locked
          ? "IN MATCH"
          : "PLACED";

    // Won: real payout. Otherwise: estimate from current odds.
    const earnings =
        b.status === "won" && b.payout != null
            ? b.payout
            : typeof odds === "number"
              ? Math.round(b.amount * odds)
              : null;

    return (
        <div className="flex justify-between items-center bg-[#610240] p-2 rounded-lg">
            <div className="text-xs flex flex-col">
                <p>game_id : {odds_id}</p>
                <div className="flex gap-2 items-center">
                    {acc ? "combo" : "team"} :{" "}
                    <span
                        style={{ color: acc ? "" : (b.team ?? "") }}
                        className="font-bold"
                    >
                        {acc ? b.combo : b.team}
                    </span>
                    <p>
                        bet_amount:{" ₦ "}
                        <span className="text-white font-bold">{b.amount}</span>
                    </p>
                </div>
            </div>
            <div className="text-xs flex flex-col text-center">
                <p>status : {status_label}</p>
                <div className="text-[10px]">
                    {settled ? null : acc ? (
                        <p>Locks when first leg starts</p>
                    ) : !locked ? (
                        <p>{`${pad(closeTime.min)}:${pad(closeTime.sec)}`}</p>
                    ) : (
                        <p>Game Started</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-xs flex flex-col items-end">
                    <p>
                        odds :{" "}
                        {typeof odds === "number" ? `${odds.toFixed(2)}x` : "–"}
                    </p>
                    <p>
                        {b.status === "won" ? "payout:" : "est. earnings:"}
                        {" ₦ "}
                        <span className="text-white font-bold">
                            {earnings ?? "–"}
                        </span>
                    </p>
                </div>
                <ImBin size={24} className="hover:text-white" />
            </div>
        </div>
    );
}
