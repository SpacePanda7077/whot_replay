// auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SignUpResponseType = {
    user_id: string;
    unique_id: string;
};

type LoginResponseType = {
    ret: string;
    email: string;
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

    // NEW: true only when logged in AND not expired
    isLoggedIn: () => boolean;
};

export const useAuth = create<AuthType>()(
    persist(
        (set, get) => ({
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
                    login_expires_at: Date.now() + 30 * 60 * 1000, // 30 min
                }),

            logout: () =>
                set({
                    login_result: null,
                    login_expires_at: null,
                    sign_up_result: null,
                }),

            isLoggedIn: () => {
                const { login_result, login_expires_at } = get();
                return (
                    !!login_result &&
                    !!login_expires_at &&
                    login_expires_at > Date.now()
                );
            },
        }),
        {
            name: "auth-storage",
        },
    ),
);
