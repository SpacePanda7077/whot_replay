import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-8wpmb8mfbcuttkxg.us.auth0.com"
            clientId="P2pHHaWTqig97q7zsjts4YjIjqrXE2cv"
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </Auth0Provider>
    </React.StrictMode>,
);
