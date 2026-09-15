import { create } from "zustand";

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
    setSignUpResult: (res: SignUpResponseType) => void;
    setLoginResult: (res: LoginResponseType) => void;
};

export const useAuth = create<AuthType>((set) => ({
    sign_up_result: null,
    login_result: null,
    setSignUpResult: (res) => set({ sign_up_result: res }),
    setLoginResult: (res) => set({ login_result: res }),
}));

