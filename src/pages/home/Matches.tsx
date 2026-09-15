import LiveMatch from "./LiveMatch";
import UpcomingMatch from "./UpcomingMatch";
import Accumulator from "./Accumulator";
import { dummy_replay, useReplayStore } from "../../store/replay.store";
import NotLoggedIn from "../../components/info/not-logged-in";
import { useAuth } from "../../store/auth-store";

export default function Matches() {
    const live_replay = useReplayStore((s) => s.live);
    const logs = useAuth((s) => s.login_result);
    const upcoming_replays = useReplayStore((s) => s.upcoming_replay);

    return (
        <>
            <div className="w-full mt-7 flex flex-col gap-3 text-white/70">
                {live_replay && (
                    <LiveMatch id={live_replay.id} teams={live_replay.teams} />
                )}

                <h1 className="font-bold">Upcoming Replays</h1>
                {logs ? (
                    <div>
                        {upcoming_replays.length > 0 ? (
                            <div className=" relative mb-20 flex flex-col gap-3">
                                {upcoming_replays.map((m) => (
                                    <UpcomingMatch
                                        key={m.id}
                                        id={m.id}
                                        teams={m.teams}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className=" text-center text-white text-lg font-bold w-full">
                                No Games Available !!!
                            </div>
                        )}
                    </div>
                ) : (
                    <div className=" relative mb-20 flex flex-col gap-3">
                        {!logs && <NotLoggedIn />}
                        {dummy_replay.map((m) => (
                            <UpcomingMatch
                                key={m.id}
                                id={m.id}
                                teams={m.teams}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Accumulator />
        </>
    );
}

