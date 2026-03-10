// src/app/members/[id]/edit/page.js
import { getMemberById } from "@/lib/member-actions"; // Using your centralized library
import EditMemberForm from "@/components/EditMemberForm";
import { notFound } from "next/navigation";

export default async function EditMemberPage({ params }) {
  // params is an object containing the dynamic [id] from the URL
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Call your existing library function
  const member = await getMemberById(id);

  // 2. Standardize the "Not Found" logic
  if (!member) {
    notFound();
  }

  return (
    <div className="p-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Edit Member: <span className="text-blue-600">{member.member_code}</span>
      </h1>

      {/* 3. Pass the data to the Client Component Form */}
      <EditMemberForm member={member} />
    </div>
  );
}
