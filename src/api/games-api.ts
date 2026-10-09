import axios from "axios";
import { ENDPOINT } from "./glogal-api";
import { EventBus } from "../game/EventBus";
import { useHistoryStore } from "../store/history";

export const GetAccumulatorReplays = async () => {
    const res = await axios.get(`${ENDPOINT}/api/accumulators`);
    return res.data;
};

export const GetGames = async () => {
    const res = await axios.get(`${ENDPOINT}/api/games`);
    return res.data;
};

//=========================================================================//
//======================GET STREAMING GAMES================================//
//=========================================================================//

// Opens the replay stream for one game and forwards its events to the
// Phaser scene through EventBus. Returns a cleanup function.
//
// IMPORTANT: call this from a useEffect and return the cleanup function.
// Do NOT call it from react-query's queryFn: react-query would store the
// cleanup function as "data" and never call it, so the old stream would
// keep feeding frames to whichever scene is active.
export const streamGame = (id: string) => {
    const es = new EventSource(`${ENDPOINT}/api/games/${id}/stream`);

    es.addEventListener("start", (e) => {
        EventBus.emit("game_start", JSON.parse((e as MessageEvent).data));
    });

    es.addEventListener("frame", (e) => {
        EventBus.emit("frame", JSON.parse((e as MessageEvent).data));
    });

    es.addEventListener("end", (e) => {
        // { game_id, winner_player_index, winner_team, final_hands }
        // useLiveSlots listens for this to replace the finished game.
        EventBus.emit("game_end", JSON.parse((e as MessageEvent).data));

        const { refetch, setRefetch } = useHistoryStore.getState();
        setRefetch(refetch + 1);
        es.close();
    });

    es.onerror = () => {
        // On a network blip EventSource reconnects by itself and resumes
        // with Last-Event-ID (the server supports it), so don't close here.
        // If the browser already gave up (e.g. HTTP error), it is CLOSED.
        if (es.readyState === EventSource.CLOSED) {
            console.warn(`replay stream for ${id} closed`);
        }
    };

    return () => es.close();
};

