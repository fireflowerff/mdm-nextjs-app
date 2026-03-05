// src/app/members/page.js
import { getMembers, updateMemberStatus } from "@/lib/member-actions";
import Search from "@/components/Search";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { auth, signOut } from "@/auth";
import Pagination from "@/components/Pagination";

export default async function MembersPage(props) {
  const session = await auth(); // Get the current user session
  const isAdmin = session?.user?.role === "ADMIN";

  console.log("Current User Role:", session?.user?.role); // This shows in your P17 terminal

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  // Destructure the response from our new safe function
  // const { data: members, error } = await getMembers(query);

  const currentPage = Number(searchParams?.page) || 1;
  const {
    data: members,
    totalPages,
    error,
  } = await getMembers(query, currentPage);

  if (error) {
    return (
      <div className="p-10 text-red-600 bg-red-50 border border-red-200 rounded">
        <strong>Error:</strong> {error}
        <p className="text-sm mt-2 text-red-500">
          Please ensure your PostgreSQL service is running in WSL.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">MDM Master Data</h1>
          <p className="text-sm font-medium text-gray-700">
            Welcome, {session.user.name}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded uppercase">
              {session.user.role}
            </span>
          </p>
          {session.user.lastLogin && (
            <p className="text-xs text-gray-400">
              Last session:{" "}
              {new Date(session.user.lastLogin).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors">
            Sign Out
          </button>
        </form>
      </div>

      {/* Search UI */}
      <Search />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MDM: Member Master</h1>
        <Link
          href="/members/new"
          className="bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
          + Add Member
        </Link>

        <Link
          href="/members/archive"
          className="bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
          View Archived/Deleted Members
        </Link>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>

            <th className="border p-2">Action</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td className="border p-3 text-blue-600 font-medium">
                <Link
                  href={`/members/${member.member_code}`}
                  className="hover:underline"
                >
                  {member.member_code}
                </Link>
              </td>
              <td className="border p-2">
                {member.first_name} {member.last_name}
              </td>

              <td className="border p-2">{member.status}</td>
              <td className="border p-2">
                {/* We use a Server Action here directly */}
                <form
                  action={updateMemberStatus.bind(
                    null,
                    member.id,
                    member.status,
                  )}
                >
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Toggle Status
                  </button>
                </form>
              </td>
              <td className="border p-2">
                {/* We use a Server Action here directly */}
                <span className="text-gray-300">|</span>
                <DeleteButton id={member.id} isAdmin={isAdmin} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} />
    </div>
  );
}
