interface Prop {
    setSelected: React.Dispatch<
        React.SetStateAction<{
            name: string;
            code: string;
        }>
    >;
    onPick: () => void;
    bankList: { name: string; code: string }[];
}

export default function PaymentMethodList({
    setSelected,
    onPick,
    bankList,
}: Prop) {
    return (
        <div className="absolute z-10 left-0 top-full bg-[#370723] w-full max-h-50 overflow-y-auto p-2 border border-[#FFB800]/20">
            {bankList.length === 0 ? (
                <div className="text-white/50">No banks found</div>
            ) : (
                bankList.map((bank, i) => (
                    <div
                        key={i}
                        // onMouseDown fires before the input's onBlur,
                        // so the click isn't lost when the list closes
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setSelected(bank);
                            onPick();
                        }}
                        className="cursor-pointer py-1 hover:bg-white/10"
                    >
                        {bank.name}
                    </div>
                ))
            )}
        </div>
    );
}
