import { useEffect, useState } from "react";
import UpcomingMatchTopInfo from "./UpcomingMatchTopInfo";
import { Players } from "../../store/replay.store";
import Choices from "./Choices";
interface Prop {
    id: string;
    status: string;
    teams: Players;
    time: {
        open_at: string;
        close_at: string;
    };
    choosenBet: {
        game_id: string;
        team: string;
    };
    setChoosenBet: React.Dispatch<
        React.SetStateAction<{
            game_id: string;
            team: string;
        }>
    >;
    refetch: () => void;
}

export default function UpcomingMatch({
    id,
    status,
    teams,
    time,
    choosenBet,
    setChoosenBet,
    refetch,
}: Prop) {
    return (
        <>
            <div className="shrink-0 rounded-lg border border-[#ffa500]/20 p-3 shadow-md shadow-black sm:p-4">
                <UpcomingMatchTopInfo
                    id={id}
                    status={status}
                    time={time}
                    refetch={refetch}
                />
                <Choices
                    id={id}
                    status={status}
                    teams={teams}
                    choosenBet={choosenBet}
                    setChoosenBet={setChoosenBet}
                />
            </div>
        </>
    );
}
