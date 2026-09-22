import axios from "axios";
import { ENDPOINT } from "./glogal-api";

export const Place_Bet = async (
    token: string,
    data: {
        game_id: string;
        team: string;
        amount: number;
        slip_code?: string;
    },
) => {
    console.log({ ...data, slip_code: data.slip_code || "" });
    const res = await axios.post(
        `${ENDPOINT}/api/bets`,
        {
            game_id: data.game_id,
            team: data.team,
            amount: data.amount,
            slip_code: data.slip_code || "",
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return res;
};

export const Get_Bets = async (token: string) => {
    const res = await axios.get(`${ENDPOINT}/api/bets`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
};

