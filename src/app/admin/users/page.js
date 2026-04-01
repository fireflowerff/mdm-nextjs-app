import pool from "@/lib/db";
import UserForm from "./UserForm";
import { getAllMenuGroups } from "@/lib/menu";

export default async function UsersPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";

  // Fetch Users with their Menu Group Name for the UI
  const { rows: users } = await pool.query(
    `SELECT u.*, mg.menu_name 
     FROM public.users u 
     LEFT JOIN public.menu_group mg ON u.menu_group_id = mg.id
     WHERE u.username ILIKE $1 OR u.email ILIKE $1
     ORDER BY u.username ASC`,
    [`%${q}%`],
  );

  const groups = await getAllMenuGroups();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Maintenance</h1>
          <p className="text-sm text-gray-500">
            Manage system access and menu assignments.
          </p>
        </div>
        <UserForm groups={groups} />
      </div>

      {/* Simple Search Bar */}
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by username or email..."
          className="w-full max-w-md border p-2 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role / Status</th>
              <th className="p-4">Assigned Menu</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-800">{u.username}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mr-2">
                    {u.role}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${u.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {u.menu_name || (
                    <span className="text-gray-300 italic">None</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <UserForm initialData={u} groups={groups} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
