import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { DepositStatus } from "../api/wallet-api";

export const useFetchTxStatus = () => {
    const logs = useAuth((s) => s.login_result);
    const [depositReference, setDepositReference] = useState<string | null>(
        null,
    );

    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"SUCCESS" | "ERROR">("ERROR");
    const [msg, setMsg] = useState<string>("ERROR");

    const { mutate: checkDepositStatus } = useMutation({
        mutationFn: (data: { token: string; reference: string }) =>
            DepositStatus(data.token, data.reference),

        onSuccess: (data) => {
            console.log("Deposit status:", data.status);
        },

        onError: (err) => {
            console.error("Failed to check deposit status", err);
        },
    });

    useEffect(() => {
        if (!depositReference || !logs?.token) return;

        let stopped = false;
        let attempts = 0;

        const checkStatus = async () => {
            try {
                const response = await DepositStatus(
                    logs.token,
                    depositReference,
                );

                console.log("Deposit status:", response.status);

                if (response.status === "success") {
                    stopped = true;

                    setMsg("DEPOSIT SUCCESSFUL");
                    setStatus("SUCCESS");
                    setShow(true);
                    setDepositReference(null);

                    return;
                }

                if (response.status === "failed") {
                    stopped = true;

                    setMsg("DEPOSIT FAILED");
                    setStatus("ERROR");
                    setShow(true);
                    setDepositReference(null);

                    return;
                }

                // pending
                attempts++;

                // Stop after ~5 minutes
                if (attempts >= 100) {
                    stopped = true;
                    setDepositReference(null);

                    setMsg("DEPOSIT STATUS CHECK TIMED OUT");
                    setStatus("ERROR");
                    setShow(true);
                }
            } catch (error) {
                console.error("Error checking deposit:", error);
            }
        };

        // Check immediately
        checkStatus();

        // Then every 3 seconds
        const interval = setInterval(() => {
            if (!stopped) {
                checkStatus();
            }
        }, 3000);

        return () => {
            stopped = true;
            clearInterval(interval);
        };
    }, [depositReference, logs?.token]);

    return {
        depositReference,
        setDepositReference,
        show,
        msg,
        status,
        setMsg,
        setStatus,
        setShow,
    };
};

