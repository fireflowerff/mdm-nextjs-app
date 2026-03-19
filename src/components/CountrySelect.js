// components/CountrySelect.js
import { getCountries } from "@/lib/country-actions";

export default async function CountrySelect({ defaultValue = "" }) {
  // Fetching data directly in the component (Server-side)
  const { data: countries, error } = await getCountries();

  if (error)
    return <p className="text-red-500">Error loading countries: {error}</p>;
  if (!countries || countries.length === 0) return <p>No countries found.</p>;

  return (
    <div>
      <label className="block font-medium mb-1 text-gray-700">Country</label>
      <select
        name="country_id"
        required
        defaultValue={defaultValue}
        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 bg-white outline-none"
      >
        <option value="" disabled>
          Select a country...
        </option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.country_name}
          </option>
        ))}
      </select>
    </div>
  );
}
