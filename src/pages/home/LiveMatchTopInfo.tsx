import { useEffect, useRef, useState } from "react";

interface Prop {
    id: string;
    status: string;
}

export default function LiveMatchTopInfo({ id, status }: Prop) {
    return (
        <>
            <div>
                <div className="relative flex items-center justify-between">
                    <div className="text-[10px] flex items-center gap-2">
                        <div
                            style={{
                                backgroundColor: "#f01e07",
                                color:
                                    status === "scheduled"
                                        ? "#2E071B"
                                        : "white",
                            }}
                            className="flex gap-2 items-center w-fit py-1 px-2 rounded-lg font-bold"
                        >
                            <p>{status}</p>
                        </div>
                        <p className="text-white/70">#{id}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
