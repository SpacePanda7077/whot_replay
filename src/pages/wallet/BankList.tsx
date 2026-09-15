interface Prop {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function BankList({ setSelected }: Prop) {
    const BankList = [
        "Select Bank",
        "Access Bank",
        "Eco Bank",
        "Fidelity Bank",
        "First Bank",
        "Guaranty Trust bank",
        "Heritage Bank",
        "KeyStone Bank",
        "Stanbic Bank",
        "Sterling Bank",
        "UBA",
        "Union Bank",
        "Unity Bank",
        "Wema Bank",
        "Zenith Bank",
    ];
    return (
        <>
            <div className="absolute bg-[#370723] w-full max-h-50 overflow-y-auto p-2 border border-[#FFB800]/20">
                {BankList.map((bank, index) => (
                    <div
                        onClick={() => setSelected(bank)}
                        className="cursor-pointer"
                        key={index}
                    >
                        {bank}
                    </div>
                ))}
            </div>
        </>
    );
}

