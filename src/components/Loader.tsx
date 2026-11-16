import { Oval } from "react-loader-spinner";

interface Props {
    /** Seconds remaining before we stop checking (optional). */
    secondsLeft?: number | null;
}

export default function LoadingState({ secondsLeft }: Props) {
    const timedOutSoon =
        typeof secondsLeft === "number" && secondsLeft <= 30 && secondsLeft > 0;

    return (
        <div className="fixed top-0 left-0 z-2000000 w-full h-full bg-black/60 flex flex-col gap-4 justify-center items-center">
            <Oval
                height={180}
                width={180}
                color="#FFB800"
                secondaryColor="#f3f3f3"
                strokeWidth={3}
                visible={true}
                ariaLabel="oval-loading"
            />
            <p className="text-center text-white text-xl font-bold">
                Checking Transaction ...
            </p>
            {typeof secondsLeft === "number" && secondsLeft > 0 && (
                <p
                    className={`text-center text-sm font-medium ${
                        timedOutSoon ? "text-[#FFB800]" : "text-white/70"
                    }`}
                >
                    {timedOutSoon
                        ? `Still checking… timeout in ${secondsLeft}s`
                        : `Timeout in ${secondsLeft}s`}
                </p>
            )}
            <p className="text-center text-white/50 text-xs max-w-xs px-4">
                Please keep this page open. Do not close or refresh until the
                check finishes.
            </p>
        </div>
    );
}
