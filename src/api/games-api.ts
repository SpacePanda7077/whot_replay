import axios from "axios";
import { ENDPOINT } from "./glogal-api";
import { EventBus } from "../game/EventBus";

export const GetReplays = async () => {
    const res = await axios.get(`${ENDPOINT}/api/replays`);
    return res.data;
};

export const GetAccumulatorReplays = async (token: string) => {
    const res = await axios.get(`${ENDPOINT}/api/accumulators`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const GetGames = async (token: string) => {
    const res = await axios.get(`${ENDPOINT}/api/games`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

//=========================================================================//
//======================GET STREAMING GAMES================================//
//=========================================================================//

export const streamGame = (id: string) => {
    const es = new EventSource(`${ENDPOINT}/api/replays/${id}/stream`);

    es.addEventListener("start", (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        EventBus.emit("game_start", data);
        // initialize board state
    });

    es.addEventListener("frame", (e) => {
        const frame = JSON.parse(e.data);
        console.log(frame);
        EventBus.emit("frame", frame);
    });

    es.addEventListener("end", (e) => {
        console.log(JSON.parse(e.data));
        es.close();
    });

    es.onerror = () => es.close();

    return () => es.close(); // cleanup fn
};

