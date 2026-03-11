// src/app/countries/[id]/page.js
import { getCountryById } from "@/lib/country-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCapitalWeather } from "@/lib/weather";

export default async function ViewCountryPage({ params }) {
  const { id } = await params;
  const country = await getCountryById(id);
  // 1. Ensure coordinates are valid numbers
  const lat = parseFloat(country.latitude);
  const lng = parseFloat(country.longitude);

  // 2. Define the 'zoom' level by creating a box around the point
  // Adjust 0.1 to 0.5 if you want to see a wider area
  const delta = 0.1;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;

  if (!country) {
    notFound();
  }

  // Fetch weather in parallel
  const weather = country.latitude
    ? await getCapitalWeather(country.latitude, country.longitude)
    : null;

  return (
    <div className="p-10 max-w-5xl">
      {/* 1. NAVIGATION HEADER */}
      <div className="mb-6">
        <Link
          href="/countries"
          className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
        >
          <span>⬅️</span> Back to Country Master
        </Link>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🌐</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {country.country_name}
            </h1>
            <p className="text-gray-500 font-mono">{country.country_code}</p>
          </div>
        </div>
        <Link
          href={`/countries/${id}/edit`}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Edit Master Data
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Detailed Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* WEATHER CARD */}
          {weather && (
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm">
              <h2 className="text-xs font-bold text-blue-400 uppercase mb-2">
                Current Weather
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-900">
                  {weather.temp}°C
                </span>
                <span className="text-lg">{weather.condition}</span>
              </div>
              <p className="text-[10px] text-blue-400 mt-4 italic">
                Refreshed at: {new Date(weather.time).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* ... existing Geo Details & Audit ... */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Geographic Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Capital City</p>
                <p className="font-medium text-gray-800">
                  {country.capital_city || "Not Defined"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Coordinates</p>
                <p className="font-medium text-gray-800 font-mono">
                  {country.latitude}, {country.longitude}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Audit Trail
            </h2>
            <p className="text-xs text-gray-600">
              Last modified by:{" "}
              <span className="font-bold">{country.last_modified_by}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Updated: {new Date(country.updated_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right: Map Display Container */}
        <div className="lg:col-span-2">
          <div className="bg-white p-2 rounded-xl border shadow-sm h-[400px] overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
              className="rounded-lg"
            ></iframe>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400 italic">
            Reference Map centered on {country.country_name} Master Coordinates
          </p>
        </div>
      </div>
    </div>
  );
}
