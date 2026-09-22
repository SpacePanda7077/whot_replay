import Accumulator_Public from "./Accumulator_Public";
interface Prop {
    bet_amount: number;
}
export default function Accumulator({ bet_amount }: Prop) {
    return (
        <>
            <div className="fixed bottom-0 left-0 w-full p-2 text-white/40 bg-[#30031f] border border-[#ffa400]/60 rounded-t-2xl">
                <Accumulator_Public bet_amount={bet_amount} />
            </div>
        </>
    );
}

