interface Prop {
    id: string;
}
export default function UpcomingMatchTopInfo({ id }: Prop) {
    return (
        <>
            <div>
                <div className="flex items-center justify-between">
                    <div className="text-[10px] flex items-center gap-4">
                        <div className="flex gap-2 items-center text-white/60 bg-white/10 w-fit py-1 px-2 rounded-lg">
                            <p>Upcoming</p>
                        </div>
                        <p className="text-white/70">Match #{id}</p>
                    </div>
                    <p className="text-white/70 text-sm">Pari Mutual</p>
                </div>
            </div>
        </>
    );
}

