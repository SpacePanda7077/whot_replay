import { useEffect, useState } from "react";
import { bet, is_accumulator } from "../../store/history";
import { accumulator, replay, useReplayStore } from "../../store/replay.store";

// What the stakes page shows. The server only knows placed / won / lost /
// refunded; "playing" is worked out here from the state of the game(s).
export type display_status =
    | "placed"
    | "playing"
    | "won"
    | "lost"
    | "refunded";

// Same grace the live slots use after ends_at.
const END_GRACE_MS = 15_000;

const same = (a: unknown, b: unknown) => String(a) === String(b);

// A game is playing when it is locked, or when "now" is inside its
// start..end window (covers servers that use another status string while
// a game runs). Settled games are never playing.
const is_playing = (r: replay, now: number) => {
    if (r.status === "settled") return false;
    if (r.status === "locked") return true;
    const start = Date.parse(r.starts_at);
    const end = Date.parse(r.ends_at);
    return (
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        now >= start &&
        now < end + END_GRACE_MS
    );
};

export function get_display_status(
    b: bet,
    replays: replay[],
    accumulators: accumulator[],
    ended: Record<string, true>,
    now: number = Date.now(),
): string {
    // Settled bets always show what the server says.
    if (b.status !== "placed") return b.status;

    // Also "playing" when the stream finished but the server hasn't settled
    // the bet yet: it stays "playing" until the result arrives.
    const game_is_playing = (game_id?: string) => {
        if (!game_id) return false;
        if (ended[game_id]) return true;
        return replays.some((r) => same(r.id, game_id) && is_playing(r, now));
    };

    if (!is_accumulator(b)) {
        return game_is_playing(b.game_id) ? "playing" : "placed";
    }

    const acc = accumulators.find((a) => same(a.id, b.accumulator_id));
    if (!acc) return "placed";
    if (acc.status === "locked") return "playing";
    return acc.legs.some((l) => game_is_playing(l.game_id))
        ? "playing"
        : "placed";
}

// Hook version for components: re-checks every few seconds so the label
// flips to PLAYING when the game starts, without waiting for a refetch.
export function useDisplayStatus(b: bet) {
    const replays = useReplayStore((s) => s.replays);
    const live = useReplayStore((s) => s.live_replay);
    const accumulators = useReplayStore((s) => s.accumulator);
    const ended = useReplayStore((s) => s.ended);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (b.status !== "placed") return;
        const t = setInterval(() => setNow(Date.now()), 5_000);
        return () => clearInterval(t);
    }, [b.status]);

    return get_display_status(b, [...replays, ...live], accumulators, ended, now);
}
