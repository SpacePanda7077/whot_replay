import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../store/auth-store";
import { DepositStatus } from "../api/wallet-api";

// How long we keep polling before giving up (ms).
const DEPOSIT_CHECK_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
// How often we poll the server.
const POLL_INTERVAL_MS = 3000;

export const useFetchTxStatus = () => {
    const logs = useAuth((s) => s.login_result);
    const queryClient = useQueryClient();
    const [depositReference, setDepositReference] = useState<string | null>(
        null,
    );

    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");
    // Seconds left until we stop checking (null when not checking).
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!depositReference || !logs?.token) {
            setSecondsLeft(null);
            return;
        }

        let stopped = false;
        const startedAt = Date.now();

        const finish = (nextMsg: string, nextStatus: "SUCCESS" | "ERROR") => {
            if (stopped) return;
            stopped = true;
            setDepositReference(null);
            setSecondsLeft(null);
            setMsg(nextMsg);
            setStatus(nextStatus);
            setShow(true);
        };

        const checkStatus = async () => {
            if (stopped) return;

            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(
                0,
                Math.ceil((DEPOSIT_CHECK_TIMEOUT_MS - elapsed) / 1000),
            );
            setSecondsLeft(remaining);

            if (elapsed >= DEPOSIT_CHECK_TIMEOUT_MS) {
                finish(
                    "Deposit check timed out. If money left your account, contact support with your reference.",
                    "ERROR",
                );
                return;
            }

            try {
                const response = await DepositStatus(
                    logs.token,
                    depositReference,
                );

                console.log("Deposit status:", response.status);

                if (response.status === "success") {
                    // Money landed: refresh the balance and the transaction list.
                    queryClient.invalidateQueries({
                        queryKey: ["get_wallet_info"],
                    });
                    queryClient.invalidateQueries({ queryKey: ["getTxQuery"] });
                    finish("DEPOSIT SUCCESSFUL", "SUCCESS");
                    return;
                }

                if (response.status === "failed") {
                    queryClient.invalidateQueries({ queryKey: ["getTxQuery"] });
                    finish("DEPOSIT FAILED", "ERROR");
                    return;
                }
                // still pending → keep polling
            } catch (error) {
                console.error("Error checking deposit:", error);
                // network blip – keep trying until the overall timeout
            }
        };

        // Check immediately, then every few seconds.
        checkStatus();
        const interval = setInterval(checkStatus, POLL_INTERVAL_MS);

        // Also tick the countdown every second so the UI stays smooth.
        const tick = setInterval(() => {
            if (stopped) return;
            const remaining = Math.max(
                0,
                Math.ceil(
                    (DEPOSIT_CHECK_TIMEOUT_MS - (Date.now() - startedAt)) /
                        1000,
                ),
            );
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                finish(
                    "Deposit check timed out. If money left your account, contact support with your reference.",
                    "ERROR",
                );
            }
        }, 1000);

        return () => {
            stopped = true;
            clearInterval(interval);
            clearInterval(tick);
        };
    }, [depositReference, logs?.token, queryClient]);

    return {
        depositReference,
        setDepositReference,
        show,
        msg,
        status,
        setMsg,
        setStatus,
        setShow,
        secondsLeft,
    };
};
