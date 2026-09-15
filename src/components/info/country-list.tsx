import { country_list } from "../../store/country-list";
interface CountryListProps {
    search: string;
    onSelect: (country: string) => void;
}
export default function CountryList({ search, onSelect }: CountryListProps) {
    const filteredCountries = country_list.filter((country) =>
        country.toLowerCase().includes(search.toLowerCase()),
    );
    return (
        <div className="absolute left-0 top-full z-50 mt-1 w-full max-h-[30vh] overflow-y-auto rounded-lg bg-[#2e071b] border border-white/20 p-1">
            {" "}
            {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                    <div
                        key={country}
                        onClick={() => onSelect(country)}
                        className="cursor-pointer rounded-md p-2 hover:bg-[#47082f]"
                    >
                        {" "}
                        {country}{" "}
                    </div>
                ))
            ) : (
                <div className="p-2 text-white/50"> No country found </div>
            )}{" "}
        </div>
    );
}
