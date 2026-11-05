export type Side = "orange" | "blue";

const SIDE_LETTER: Record<Side, "O" | "B"> = { orange: "O", blue: "B" };

// An accumulator is exactly 3 matches: you can't bet 1 or 2, only all 3.
export const ACCUMULATOR_LEGS = 3;

// How many legs have a pick.
export const picked_count = (combo: string[]) => combo.filter(Boolean).length;

// True only when all 3 legs have a pick.
export const is_complete = (combo: string[]) =>
    picked_count(combo) === ACCUMULATOR_LEGS;

// ["orange", "blue", "orange"] -> "OBO", the format POST /api/accumulators/bets
// expects and the key the odds stream uses for accumulators.
// Returns "" until all 3 legs have a valid pick (never for 1 or 2 legs).
export function to_combo_string(combo: string[], leg_count: number) {
    const full =
        leg_count === ACCUMULATOR_LEGS &&
        combo.length === ACCUMULATOR_LEGS &&
        combo.every((c) => c === "orange" || c === "blue");
    return full ? combo.map((c) => SIDE_LETTER[c as Side]).join("") : "";
}
