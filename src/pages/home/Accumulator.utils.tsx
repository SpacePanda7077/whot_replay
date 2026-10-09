export type Side = "orange" | "blue";

const SIDE_LETTER: Record<Side, "O" | "B"> = { orange: "O", blue: "B" };

// How many legs have a pick.
export const picked_count = (combo: string[]) => combo.filter(Boolean).length;

// ["orange", "blue"] -> "OB", the format POST /api/accumulators/bets expects
// and the key the odds stream uses for accumulators.
// Returns "" until every leg has a valid pick.
export function to_combo_string(combo: string[], leg_count: number) {
    const full =
        combo.length === leg_count &&
        combo.every((c) => c === "orange" || c === "blue");
    return full ? combo.map((c) => SIDE_LETTER[c as Side]).join("") : "";
}

