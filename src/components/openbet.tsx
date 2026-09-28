import { ImBin } from "react-icons/im";
import { bet } from "../store/history";
import { getTimeRemaining } from "../pages/home/UpcomingMatchTopInfo";
import { useReplayStore } from "../store/replay.store";
import { useEffect, useState } from "react";
interface Prop {
    bet: bet;
}
export default function OpenBet({ bet: b }: Prop) {
    const [status, setStatus] = useState("PLACED");
    const [closeTime, setCloseTime] = useState({ min: 0, sec: 0 });
    const time = useReplayStore((s) => s.replays).find(
        (f) => f.id === b.game_id,
    )?.bets_lock_at;
    useEffect(() => {
        if (!time) return;
        const timer = setInterval(() => {
            const { minutes: closeMin, seconds: closeSec } =
                getTimeRemaining(time);
            setCloseTime({ min: closeMin, sec: closeSec });

            if (closeMin === 0 && closeSec === 0) {
                setStatus("IN MATCH");
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <>
            <div className="flex justify-between items-center bg-[#610240] p-2 rounded-lg">
                <div className="text-xs flex flex-col">
                    <p>game_id : {b.id}</p>
                    <div className="flex gap-2 items-center">
                        team :{" "}
                        <span
                            style={{
                                color: b.team.toString(),
                            }}
                            className="font-bold"
                        >
                            {b.team}
                        </span>
                        <p>
                            bet_amount:{" ₦ "}
                            <span className="text-white font-bold">
                                {b.amount}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="text-xs flex flex-col text-center">
                    <p>status : {status}</p>
                    <div className="text-[10px]">
                        {status === "PLACED" ? (
                            <p> {`${closeTime.min}: ${closeTime.sec}`}</p>
                        ) : (
                            <p>Game Started</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs flex flex-col items-end">
                        <p>odds : 2.30x</p>
                        <p>
                            earnings:{" ₦ "}
                            <span className="text-white font-bold">2300</span>
                        </p>
                    </div>
                    <ImBin size={24} className="hover:text-white" />
                </div>
            </div>
        </>
    );
}

