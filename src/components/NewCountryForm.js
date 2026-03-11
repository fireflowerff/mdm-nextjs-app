"use client";

import { createCountry } from "@/lib/country-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default function NewCountryForm() {
  const router = useRouter();

  async function handleSubmit(formData) {
    const result = await createCountry(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Country master data created!");
      setTimeout(() => {
        router.push("/countries");
        router.refresh();
      }, 1500);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Code */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Country Code (e.g., TH, JP)
          </label>
          <input
            name="country_code"
            required
            maxLength={10}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none uppercase"
            placeholder="ISO Code"
          />
        </div>

        {/* Country Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Full Country Name
          </label>
          <input
            name="country_name"
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="e.g. Thailand"
          />
        </div>
      </div>

      {/* Capital City */}
      <div>
        <label className="block font-medium mb-1 text-gray-700">
          Capital City
        </label>
        <input
          name="capital_city"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="e.g. Bangkok"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Latitude */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Latitude
          </label>
          <input
            name="latitude"
            type="number"
            step="any"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        {/* Longitude */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Longitude
          </label>
          <input
            name="longitude"
            type="number"
            step="any"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div className="pt-6 flex gap-4 border-t">
        <SubmitButton label="Save Country" />
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
