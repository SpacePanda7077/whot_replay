import { SetStateAction, useEffect, useState } from "react";

import UpcomingMatchTopInfo from "./UpcomingMatchTopInfo";
import { Players } from "../../store/replay.store";
import UpcomingAccumulatorTopInfo from "./UpcomingAccumulatorTopInfo";
import AccumulatorChoices from "./AccumulatorChoices";
import { Player } from "../../game/components/Player";

interface Prop {
    id: string;
    legs: { game_id: string; players: Players }[];
    choosenBet: {
        game_id: string;
        combo: string[];
    };
    setChoosenBet: React.Dispatch<
        React.SetStateAction<{
            game_id: string;
            combo: string[];
        }>
    >;
}

export default function UpcomingAccumulator({
    id,
    legs,
    choosenBet,
    setChoosenBet,
}: Prop) {
    const [show, setShow] = useState(false);
    return (
        <>
            <div className="p-2 py-4 border border-[#ffa500]/20 rounded-lg flex flex-col gap-2 shadow-lg">
                <UpcomingAccumulatorTopInfo
                    id={id}
                    show={show}
                    setShow={setShow}
                />
                {show && (
                    <div className="bg-[#1C0310] rounded-md p-2">
                        {legs.map((l, i) => (
                            <AccumulatorChoices
                                key={l.game_id}
                                id={id}
                                index={i}
                                teams={l.players}
                                choosenBet={choosenBet}
                                setChoosenBet={setChoosenBet}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

