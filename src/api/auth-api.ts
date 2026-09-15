import axios from "axios";
import { ENDPOINT } from "./glogal-api";

export const SignUp = async (data: {
    full_name: string;
    email: string;
    password: string;
    country: string;
}) => {
    const res = await axios.post(`${ENDPOINT}/api/auth/signup`, data);
    return res.data;
};

export const LogIn = async (data: { email: string; password: string }) => {
    const res = await axios.post(`${ENDPOINT}/api/auth/login`, data);
    return res.data;
};

