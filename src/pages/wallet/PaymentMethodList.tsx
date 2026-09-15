interface Prop {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function PaymentMethodList({ setSelected }: Prop) {
    const BankList = [
        "Pay With Transfer",
        "PayStack",
        "PalmPay",
        "Whot Pay",
        "Credo",
        "USDT TRC20",
        "USDT ERC20",
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

