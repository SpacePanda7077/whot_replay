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
            <div className="p-4 border border-[#ffa500]/20 rounded-lg  shadow-lg">
                <UpcomingMatchTopInfo
                    id={id}
                    status={status}
                    time={time}
                    refetch={refetch}
                />
                <Choices
                    id={id}
                    teams={teams}
                    choosenBet={choosenBet}
                    setChoosenBet={setChoosenBet}
                />
            </div>
        </>
    );
}

