import axios from "axios";
import { ENDPOINT } from "./glogal-api";

export const Get_Tx = async (token: string) => {
    const res = await axios.get(`${ENDPOINT}/api/wallet/transactions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
};
