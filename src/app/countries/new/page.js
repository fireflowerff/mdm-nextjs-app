import NewCountryForm from "@/components/NewCountryForm";

export default function NewCountryPage() {
  return (
    <div className="p-10 max-w-3xl">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Add Master Country</h1>
        <p className="text-sm text-gray-500">
          Add a new location to the MDM system.
        </p>
      </div>

      <NewCountryForm />
    </div>
  );
}
