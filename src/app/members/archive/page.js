import { getArchivedMembers } from "@/lib/member-actions";
import Link from "next/link";
import { recoverMember } from "@/lib/member-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ArchivePage() {
  // Fetch only deleted members
  const { data: deletedMembers } = await getArchivedMembers();

  // Inline Server Action for recovery button
  async function handleRecover(formData) {
    "use server";
    const id = formData.get("id");
    await recoverMember(id);
    redirect("/members"); // Send them back to the main list after recovery
  }

  return (
    <div className="p-10">
      <Link href="/members" className="text-blue-500 hover:underline">
        ← Back to Member List
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">
        Archive (Deleted Members)
      </h1>

      {deletedMembers.length === 0 ? (
        <p className="text-gray-500">No deleted members found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Code</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {deletedMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="border p-3">{member.member_code}</td>
                <td className="border p-3">
                  {member.first_name} {member.last_name}
                </td>
                <td className="border p-3 text-center">
                  <form action={handleRecover}>
                    <input type="hidden" name="id" value={member.id} />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Restore
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
