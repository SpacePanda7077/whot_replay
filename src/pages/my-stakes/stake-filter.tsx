import { useState } from "react";
type FilterType = "All" | "Active" | "Won" | "Lost";
export default function StakeFilter() {
    const [selected, setSelected] = useState<FilterType>("All");
    return (
        <div className="flex items-center gap-4 text-sm">
            <div
                onClick={() => setSelected("All")}
                className={`px-4 py-1 rounded-3xl border border-white/20 cursor-pointer
                   ${selected === "All" ? "bg-[#FFB800] text-[#2E041D]" : "bg-white/5 text-white"} `}
            >
                All
            </div>
            <div
                onClick={() => setSelected("Active")}
                className={`px-4 py-1 rounded-3xl border border-white/20 cursor-pointer
                   ${selected === "Active" ? "bg-[#FFB800] text-[#2E041D]" : "bg-white/5 text-white"} `}
            >
                Active
            </div>
            <div
                onClick={() => setSelected("Won")}
                className={`px-4 py-1 rounded-3xl border border-white/20 cursor-pointer
                   ${selected === "Won" ? "bg-[#FFB800] text-[#2E041D]" : "bg-white/5 text-white"} `}
            >
                Won
            </div>
            <div
                onClick={() => setSelected("Lost")}
                className={`px-4 py-1 rounded-3xl border border-white/20 cursor-pointer
                   ${selected === "Lost" ? "bg-[#FFB800] text-[#2E041D]" : "bg-white/5 text-white"} `}
            >
                Lost
            </div>
        </div>
    );
}

