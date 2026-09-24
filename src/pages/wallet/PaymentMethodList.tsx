interface Prop {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function PaymentMethodList({ setSelected }: Prop) {
    const BankList = [
        `opay`,
        `paystack`,
        `marasoftpay`,
        `payaza`,
        `nomba`,
        `credo`,
        `crypto`,
        `palmpay`,
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

