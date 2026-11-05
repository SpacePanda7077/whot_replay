interface Prop {
    // share of the pool on the orange side, 0-100
    orange_percent: number;
    // false when the split is outside the allowed range
    passed?: boolean;
}

// Orange/blue split bar shared by single matches and accumulator legs.
export default function SplitBar({ orange_percent, passed = true }: Prop) {
    const orange_pct = Math.round(orange_percent);
    return (
        <div className="mt-1">
            <div className="h-1 rounded bg-blue-500/70 overflow-hidden">
                <div
                    className="h-full bg-orange-500"
                    style={{ width: `${orange_pct}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-white/60">
                <span>{orange_pct}% orange</span>
                {!passed && <span className="text-red-300">too lopsided</span>}
                <span>{100 - orange_pct}% blue</span>
            </div>
        </div>
    );
}
