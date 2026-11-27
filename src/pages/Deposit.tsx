import { FC, useState } from "react";
import CurrencyList, { Currency } from "../components/CurrencyList";
import DepositForm from "../components/DepositForm";

const Deposit: FC = () => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        null,
    );

    const handleSelectCurrency = (currency: Currency) => {
        setSelectedCurrency(currency);
    };

    const handleBack = () => {
        setSelectedCurrency(null);
    };

    return (
        <div className="bg-white">
            {!selectedCurrency ? (
                <CurrencyList onSelectCurrency={handleSelectCurrency} />
            ) : (
                <DepositForm
                    currency={selectedCurrency}
                    handleBack={handleBack}
                />
            )}
        </div>
    );
};

export default Deposit;

