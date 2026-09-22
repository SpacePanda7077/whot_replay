import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import Header from "../../components/header/Header";
import Matches from "./Matches";
import Accumulator from "./Accumulator";
import { useReplayStore } from "../../store/replay.store";
import { useQuery } from "@tanstack/react-query";
import { streamGame } from "../../api/games-api";
import { EventBus } from "../../game/EventBus";

export default function Home() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const liveReplay = useReplayStore((s) => s.live_replay);

    const { data: ReplayStream, error: ReplayStreamError } = useQuery({
        queryKey: ["get_replay_stream"],
        queryFn: () => streamGame(liveReplay!.id),
        enabled: liveReplay !== null,
    });

    useEffect(() => {
        if (ReplayStream) {
            console.log(ReplayStream);
        }
        if (ReplayStreamError) {
            console.log(ReplayStreamError);
        }
    }, [ReplayStream, ReplayStreamError]);

    // useEffect(()=>{
    //     EventBus.on("")
    // },[])

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center mt-30 ">
                <div className=" w-[95vw] h-full lg:h-[85vh] flex flex-col lg:flex-row gap-4">
                    <div className="w-full h-full flex items-center justify-cente  rounded-lg border-2 border-[#ffa500]/90 overflow-hidden bg-[#361527]">
                        <PhaserGame ref={phaserRef} />
                    </div>
                    <Matches />
                </div>
            </div>
        </>
    );
}

