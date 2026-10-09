import { useMemo, useState } from "react";
import { bet_key, useHistoryStore } from "../../store/history";
import StakeComponent from "./stake-component";
import StakeFilter, { FilterType, matches_filter } from "./stake-filter";
import Pagination from "./pagination";

const PAGE_SIZE = 8;

export default function StakeHistory() {
    const bets = useHistoryStore((s) => s.bets);
    const [filter, setFilter] = useState<FilterType>("All");
    const [page, setPage] = useState(1);

    const filtered = useMemo(
        () => bets.filter((b) => matches_filter(b, filter)),
        [bets, filter],
    );

    const total_pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current_page = Math.min(page, total_pages);

    const visible = useMemo(
        () =>
            filtered.slice(
                (current_page - 1) * PAGE_SIZE,
                current_page * PAGE_SIZE,
            ),
        [filtered, current_page],
    );

    const handle_filter = (f: FilterType) => {
        setFilter(f);
        setPage(1);
    };

    return (
        <div className=" w-[90vw] lg:w-[50vw] flex flex-col gap-4">
            <div className="w-full">
                <StakeFilter selected={filter} onChange={handle_filter} />
            </div>

            <div className="flex flex-col gap-2">
                {visible.length > 0 ? (
                    visible.map((bet) => (
                        <StakeComponent key={bet_key(bet)} bet={bet} />
                    ))
                ) : (
                    <p className="text-center text-white/60 py-6">
                        No {filter === "All" ? "" : filter.toLowerCase() + " "}
                        bets found
                    </p>
                )}
            </div>

            <Pagination
                page={current_page}
                total_pages={total_pages}
                onChange={setPage}
            />
        </div>
    );
}

