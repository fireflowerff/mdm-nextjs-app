// src/app/countries/[id]/edit/page.js
import { getCountryById } from "@/lib/country-actions";
import EditCountryForm from "@/components/EditCountryForm";
import { notFound } from "next/navigation";

export default async function EditCountryPage({ params }) {
  const { id } = await params; // Next.js 15 fix
  const country = await getCountryById(id);

  if (!country) {
    notFound();
  }

  return (
    <div className="p-10 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🌐</span>
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Country:{" "}
          <span className="text-blue-600">{country.country_name}</span>
        </h1>
      </div>

      <EditCountryForm country={country} />
    </div>
  );
}
