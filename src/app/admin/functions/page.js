import pool from "@/lib/db";
import FunctionForm from "./FunctionForm"; // We will create this next

export default async function FunctionsPage() {
  // Fetch the 'Inventory'
  const { rows: functions } = await pool.query(
    "SELECT * FROM app_functions ORDER BY function_code ASC",
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Function Registry
          </h1>
          <p className="text-sm text-gray-500">
            Manage all registered application pages and URLs.
          </p>
        </div>
        {/* The Form is a Client Component so it can handle Modals/Toasts */}
        <FunctionForm />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Code</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">URL</th>
              <th className="p-4 font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {functions.map((fn) => (
              <tr key={fn.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm text-blue-600">
                  {fn.function_code}
                </td>
                <td className="p-4 text-gray-700">{fn.function_name}</td>
                <td className="p-4 text-gray-500 text-sm">{fn.function_url}</td>
                <td className="p-4 text-right">
                  <FunctionForm initialData={fn} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
