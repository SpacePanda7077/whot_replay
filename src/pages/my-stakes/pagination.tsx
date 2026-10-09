interface Prop {
    page: number; // 1-based
    total_pages: number;
    onChange: (page: number) => void;
}

const MAX_BUTTONS = 5;

export default function Pagination({ page, total_pages, onChange }: Prop) {
    if (total_pages <= 1) return null;

    // Window of up to 5 page numbers around the current page.
    const start = Math.max(
        1,
        Math.min(
            page - Math.floor(MAX_BUTTONS / 2),
            total_pages - MAX_BUTTONS + 1,
        ),
    );
    const end = Math.min(total_pages, start + MAX_BUTTONS - 1);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const base =
        "px-3 py-1 rounded-3xl border border-white/20 text-sm cursor-pointer select-none";
    const idle = "bg-white/5 text-white";
    const active = "bg-[#FFB800] text-[#2E041D]";
    const disabled = "opacity-30 cursor-not-allowed";

    return (
        <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className={`${base} ${idle} ${page === 1 ? disabled : ""}`}
            >
                Prev
            </button>

            {start > 1 && (
                <>
                    <button
                        onClick={() => onChange(1)}
                        className={`${base} ${idle}`}
                    >
                        1
                    </button>
                    {start > 2 && <span className="text-white/40">…</span>}
                </>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`${base} ${p === page ? active : idle}`}
                >
                    {p}
                </button>
            ))}

            {end < total_pages && (
                <>
                    {end < total_pages - 1 && (
                        <span className="text-white/40">…</span>
                    )}
                    <button
                        onClick={() => onChange(total_pages)}
                        className={`${base} ${idle}`}
                    >
                        {total_pages}
                    </button>
                </>
            )}

            <button
                disabled={page === total_pages}
                onClick={() => onChange(page + 1)}
                className={`${base} ${idle} ${page === total_pages ? disabled : ""}`}
            >
                Next
            </button>
        </div>
    );
}
