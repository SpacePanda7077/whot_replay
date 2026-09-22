import axios from "axios";
import { ENDPOINT } from "./glogal-api";

export const Deposit = async (
    token: string,
    data: {
        amount: number;
        provider: string;
    },
) => {
    const res = await axios.post(`${ENDPOINT}/api/wallet/deposit`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
};

export const Withdraw = async (
    token: string,
    data: {
        amount: number;
    },
) => {
    const res = await axios.post(`${ENDPOINT}/api/wallet/withdraw`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
};

export const GetWallet = async (token: string) => {
    const res = await axios.get(`${ENDPOINT}/api/wallet`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
};

export const SetWallet = async (
    token: string,
    data: {
        account_name: string;
        bank_name: string;
        account_number: string;
    },
) => {
    const res = await axios.put(`${ENDPOINT}/api/wallet/withdrawal-account`, {
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
};

