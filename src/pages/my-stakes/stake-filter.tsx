import { bet, is_accumulator } from "../../store/history";

export type FilterType = "All" | "Single" | "Accumulator" | "Won" | "Lost";

export const FILTERS: FilterType[] = [
    "All",
    "Single",
    "Accumulator",
    "Won",
    "Lost",
];

export function matches_filter(b: bet, filter: FilterType) {
    switch (filter) {
        case "All":
            return true;
        case "Single":
            return !is_accumulator(b);
        case "Accumulator":
            return is_accumulator(b);
        case "Won":
            return b.status === "won";
        case "Lost":
            return b.status === "lost";
    }
}

interface Prop {
    selected: FilterType;
    onChange: (filter: FilterType) => void;
}

export default function StakeFilter({ selected, onChange }: Prop) {
    return (
        <div className="flex items-center gap-4 text-sm overflow-x-auto">
            {FILTERS.map((f) => (
                <div
                    key={f}
                    onClick={() => onChange(f)}
                    className={`px-4 py-1 rounded-3xl border border-white/20 cursor-pointer whitespace-nowrap
                   ${selected === f ? "bg-[#FFB800] text-[#2E041D]" : "bg-white/5 text-white"} `}
                >
                    {f}
                </div>
            ))}
        </div>
    );
}
