"use client";

import { useState } from "react";
import { updateCountry } from "@/lib/country-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default function EditCountryForm({ country }) {
  const router = useRouter();

  // Initialize state with existing PostgreSQL data
  const [formData, setFormData] = useState({
    country_name: country.country_name,
    capital_city: country.capital_city || "",
    latitude: country.latitude || "",
    longitude: country.longitude || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleAction(formRawData) {
    const result = await updateCountry(formRawData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Country updated successfully!");
      setTimeout(() => {
        router.push("/countries");
        router.refresh();
      }, 1500);
    }
  }

  return (
    <form
      action={handleAction}
      className="space-y-4 bg-white p-6 rounded-lg border shadow-sm"
    >
      <input type="hidden" name="id" value={country.id} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-gray-500">
            Country Code (Read-Only)
          </label>
          <input
            defaultValue={country.country_code}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed outline-none font-mono"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Country Name
          </label>
          <input
            name="country_name"
            value={formData.country_name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-700">
          Capital City
        </label>
        <input
          name="capital_city"
          value={formData.capital_city}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Latitude
          </label>
          <input
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Longitude
          </label>
          <input
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Audit Footer matches your Member Edit Form */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 italic">
        <div>
          Last modified by:{" "}
          <span className="font-semibold text-gray-700">
            {country.last_modified_by || "System"}
          </span>
        </div>
        <div>Last updated: {new Date(country.updated_at).toLocaleString()}</div>
      </div>

      <div className="pt-6 flex gap-4">
        <SubmitButton label="Update Country" />
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
