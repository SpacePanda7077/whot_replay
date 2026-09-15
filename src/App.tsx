import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home/Home";
import MyStakes from "./pages/my-stakes/my-stakes";
import Wallet from "./pages/wallet/wallet";
import WhotAfrica from "./pages/whot-africa/whot-africa";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useQuery } from "@tanstack/react-query";
import { GetGames } from "./api/games-api";
import { useEffect } from "react";
import { useAuth } from "./store/auth-store";
import { useReplayStore } from "./store/replay.store";

function App() {
    const user = useAuth((s) => s.login_result);
    const setLoginResult = useAuth((s) => s.setLoginResult);
    const setUpcoming = useReplayStore((s) => s.setUpcomingReplay);
    const { data: Games, error: GetGamesError } = useQuery({
        queryKey: ["get_games"],
        queryFn: () => GetGames(user!.token),
        enabled: user !== null,
    });

    useEffect(() => {
        if (Games) {
            console.log(Games);
            const replays = Games.games.map((id: any) => ({
                id: id.id,
                teams: [
                    { team: "orange", name: "Orange", odds: 1.2 },
                    { team: "blue", name: "Blue", odds: 1.2 },
                ],
            }));
            console.log(replays);
            setUpcoming(replays);
        }
    }, [Games, GetGamesError]);
    const getSession = () => {
        const session_data = localStorage.getItem("replay_session");
        if (!session_data) return;
        const session = JSON.parse(session_data);
        // 1. Get the current time in milliseconds
        const now = Date.now();

        // 2. Define 30 minutes in milliseconds (30 * 60 * 1000)
        const THIRTY_MINUTES_IN_MS = 1800000;

        // 3. Compare the difference
        if (now - session.logTime > THIRTY_MINUTES_IN_MS) {
            console.log("It has been MORE than 30 minutes since logging in.");
            localStorage.removeItem("replay_session");
            // Put your logic here (e.g., force log out, refresh token, etc.)
        } else {
            console.log("It has been LESS than 30 minutes.");
            setLoginResult(session);
        }
    };

    useEffect(() => {
        getSession();
    }, []);
    return (
        <div id="app">
            <Routes>
                <Route index element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/my-stakes" element={<MyStakes />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/whot-africa" element={<WhotAfrica />} />
            </Routes>
        </div>
    );
}

export default App;
