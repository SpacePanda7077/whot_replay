import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home/Home";
import MyStakes from "./pages/my-stakes/my-stakes";
import Wallet from "./pages/wallet/wallet";
import WhotAfrica from "./pages/whot-africa/whot-africa";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useEffect } from "react";
import { useAuth } from "./store/auth-store";
import ProtectedRoute from "./components/protected-route";
import { useWalletStore } from "./store/wallet-store";
import { useQuery } from "@tanstack/react-query";
import { GetWallet } from "./api/wallet-api";

function App() {
    const logs = useAuth((s) => s.login_result);

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
            </Routes>
        </div>
    );
}

export default App;
