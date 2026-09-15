import StakeComponent from "./stake-component";
import StakeFilter from "./stake-filter";

export default function StakeHistory() {
    const history = [
        {
            type: "Single",
            id: 123,
            status: "active",
            team: "Orange",
            amount_in: 1000,
            date: "2023-08-01",
            amount_out: 3000,
        },
        {
            type: "Single",
            id: 133,
            status: "won",
            team: "Blue",
            amount_in: 1000,
            date: "2023-08-01",
            amount_out: 3000,
        },
        {
            type: "Single",
            id: 133,
            status: "lost",
            team: "Orange",
            amount_in: 1000,
            date: "2023-08-01",
            amount_out: 1000,
        },
    ];
    return (
        <>
            <div className=" w-[90vw] lg:w-[50vw] flex flex-col gap-4">
                <div className="w-full">
                    <StakeFilter />
                </div>

                <div className="flex flex-col gap-2">
                    <StakeComponent />
                    <StakeComponent />
                    <StakeComponent />
                    <StakeComponent />
                    <StakeComponent />
                </div>
            </div>
        </>
    );
}

