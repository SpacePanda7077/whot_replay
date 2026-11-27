import { jwtDecode } from "jwt-decode";
import { userInfo } from "os";

export interface UserInfo {
    id: string;
    name: string;
    email: string;
}

export function decryptToken(token: any): UserInfo {
    const userInfo: UserInfo = jwtDecode<UserInfo>(token);
    return userInfo;
}

