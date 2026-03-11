// src/app/countries/page.js
import { getCountries } from "@/lib/country-actions";
import Link from "next/link";
import { syncCountryData } from "@/lib/country-actions";
import { toast } from "sonner";

export default async function CountriesPage() {
  const { data: countries, error } = await getCountries();

  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Country Master Data
        </h1>
        <Link
          href="/countries/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition-colors"
        >
          + Add Country
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Country Name</th>
              <th className="p-4 font-semibold">Capital</th>
              <th className="p-4 font-semibold">Coordinates (Lat, Lng)</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr
                key={c.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  {/* Wrap the Code in a Link to the View Page */}
                  <Link
                    href={`/countries/${c.id}`}
                    className="font-mono font-bold text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-4"
                  >
                    {c.country_code}
                  </Link>
                </td>
                <td className="p-4 font-medium text-gray-800">
                  {c.country_name}
                </td>
                <td className="p-4 text-gray-600">{c.capital_city || "-"}</td>
                <td className="p-4 text-sm text-gray-500 italic">
                  {c.latitude && c.longitude
                    ? `${c.latitude}, ${c.longitude}`
                    : "No Coordinates"}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/countries/${c.id}/edit`}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm border border-amber-200 px-3 py-1 rounded-md hover:bg-amber-50 transition-all"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SyncTrigger() {
  const handleSync = async () => {
    const code = prompt("Enter 2-letter Country Code (e.g. TH, JP, FR):");
    if (!code) return;

    toast.loading(`Syncing ${code}...`);
    const result = await syncCountryData(code);

    toast.dismiss();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <button
      onClick={handleSync}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all flex items-center gap-2"
    >
      <span>🔄</span> Sync via API
    </button>
  );
}
