import { Navigate, Outlet } from "react-router";
import { useAuth } from "../store/auth-store";

export default function ProtectedRoute() {
    const loginResult = useAuth((state) => state.login_result);
    const expiresAt = useAuth((state) => state.login_expires_at);
    const logout = useAuth((state) => state.logout);

    // Not logged in
    if (!loginResult) {
        return <Navigate to="/login" replace />;
    }

    // Login has expired
    if (!expiresAt || Date.now() >= expiresAt) {
        logout();

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

