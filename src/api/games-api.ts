import axios from "axios";
import { ENDPOINT } from "./glogal-api";

export const GetGames = async (token: string) => {
    const res = await axios.get(`${ENDPOINT}/api/games`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

