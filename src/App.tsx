import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home/Home";
import MyStakes from "./pages/my-stakes/my-stakes";
import Wallet from "./pages/wallet/wallet";
import WhotAfrica from "./pages/whot-africa/whot-africa";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useEffect, useState } from "react";
import { useAuth } from "./store/auth-store";
import ProtectedRoute from "./components/protected-route";
import { useWalletStore } from "./store/wallet-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetWallet } from "./api/wallet-api";
import Terms from "./pages/whot-africa/terms";
import Privacy_Policy from "./pages/whot-africa/privacy-policy";
import { useAuth0 } from "@auth0/auth0-react";
import { SigninWithSocials } from "./api/auth-api";
import axios from "axios";
import { toast } from "sonner";

function App() {
    const logs = useAuth((s) => s.login_result);
    const setLogin = useAuth((s) => s.setLoginResult);
    const {
        isAuthenticated,
        error: authError,
        user,
        getIdTokenClaims,
        getAccessTokenSilently,
    } = useAuth0();
    const [rawIdToken, setRawIdToken] = useState<string | null>(null);

    const {
        data: AuthData,
        error,
        mutate,
    } = useMutation({
        mutationKey: ["social_logins"],
        mutationFn: (id_token: string) => SigninWithSocials({ id_token }),
        onSuccess: (data) => {
            setRawIdToken(null);
            console.log(data);
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                console.log("status:", err.response?.status);
                console.log("body:", err.response?.data);
            }
        },
    });

    const setwallet = useWalletStore((s) => s.setWallet);
    const { data: walletdata, error: walletError } = useQuery({
        queryKey: ["get_wallet_info"],
        queryFn: () => GetWallet(logs!.token),
        enabled: logs !== null,
    });

    useEffect(() => {
        if (walletdata) {
            console.log(walletdata);
            setwallet(walletdata.data);
        }
        if (walletError) {
            console.log(walletError);
        }
    }, [walletdata, walletError]);

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log(user);
            const fetchIdToken = async () => {
                try {
                    const claims = await getIdTokenClaims();
                    if (!claims?.__raw) return;
                    console.log(claims);
                    setRawIdToken(claims.__raw); // the actual ID token JWT
                } catch (err) {
                    console.error("Error getting ID token:", err);
                }
            };
            fetchIdToken();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (rawIdToken) {
            mutate(rawIdToken);
        }
    }, [rawIdToken]);

    useEffect(() => {
        if (authError) {
            console.error("Auth0 error:", authError);
            toast.error(authError.message);
        }
    }, [authError]);

    useEffect(() => {
        if (AuthData) {
            if (AuthData.ret > 0) {
                toast.error(AuthData.msg);
            } else {
                toast.success(AuthData.msg);

                setLogin(AuthData);

                localStorage.setItem(
                    "replay_session",
                    JSON.stringify({
                        ...AuthData,
                        logTime: Date.now(),
                    }),
                );
            }
        }
        if (error) {
            console.log(error);
            console.log(error.message);
        }
    }, [AuthData, error]);

    return (
        <div id="app">
            <Routes>
                <Route index element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/my-stakes" element={<MyStakes />} />
                    <Route path="/wallet" element={<Wallet />} />
                </Route>

                <Route path="/whot-africa" element={<WhotAfrica />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<Privacy_Policy />} />
            </Routes>
        </div>
    );
}

export default App;
