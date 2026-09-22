import { create } from "zustand";
import { persist } from "zustand/middleware";

type SignUpResponseType = {
    user_id: string;
    unique_id: string;
};

type LoginResponseType = {
    ret: string;
    token: string;
    msg: string;
};

type AuthType = {
    sign_up_result: SignUpResponseType | null;
    login_result: LoginResponseType | null;
    login_expires_at: number | null;

    setSignUpResult: (res: SignUpResponseType) => void;
    setLoginResult: (res: LoginResponseType) => void;
    logout: () => void;
};

export const useAuth = create<AuthType>()(
    persist(
        (set) => ({
            sign_up_result: null,
            login_result: null,
            login_expires_at: null,

            setSignUpResult: (res) =>
                set({
                    sign_up_result: res,
                }),

            setLoginResult: (res) =>
                set({
                    login_result: res,
                    login_expires_at: Date.now() + 30 * 60 * 1000,
                }),

            logout: () =>
                set({
                    login_result: null,
                    login_expires_at: null,
                    sign_up_result: null,
                }),
        }),
        {
            name: "auth-storage",
        },
    ),
);

