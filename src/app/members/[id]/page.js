// src/app/members/[id]/page.js
import { getMemberByCode } from "@/lib/member-actions";
import Link from "next/link";

export default async function MemberDetailPage({ params }) {
  // Unpack the dynamic 'id' from the URL
  const { id } = await params;

  const { data: member, error } = await getMemberByCode(id);

  if (error || !member) {
    return <div className="p-10 text-red-500">Member not found.</div>;
  }

  return (
    <div className="p-10">
      <Link href="/members" className="text-blue-500 hover:underline">
        ← Back to List
      </Link>

      <h1 className="text-3xl font-bold mt-4">Member Detail: {id}</h1>

      <div className="mt-6 p-6 border rounded shadow-sm bg-white">
        <p>
          <strong>Full Name:</strong> {member.first_name} {member.last_name}
        </p>
        <p>
          <strong>Status:</strong> {member.status}
        </p>
        <p>
          <strong>Email:</strong> {member.email || "N/A"}
        </p>
      </div>

      <div className="mt-10 border-t pt-6 text-sm text-gray-500">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Audit History
        </h2>
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
          <div>
            <p>
              <strong>Date Created:</strong>
            </p>
            <p>{new Date(member.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p>
              <strong>Last Modified By:</strong>
            </p>
            <p className="text-blue-600 font-medium">
              {member.last_modified_by || "Original Import"}
            </p>
          </div>
          <div className="col-span-2">
            <p>
              <strong>Last System Update:</strong>
            </p>
            <p>{new Date(member.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
