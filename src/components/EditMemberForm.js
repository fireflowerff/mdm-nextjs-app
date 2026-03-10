"use client";

import { useState } from "react"; // 1. Add useState
import { updateMember } from "@/lib/member-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default function EditMemberForm({ member }) {
  const router = useRouter();

  // 2. Initialize local state with the member data
  const [formData, setFormData] = useState({
    first_name: member.first_name,
    last_name: member.last_name,
    email: member.email,
  });

  // Handle input changes locally
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleUpdate(formRawData) {
    const result = await updateMember(formRawData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Member updated successfully!");

      setTimeout(() => {
        router.push("/members");
        router.refresh();
      }, 1500);
    }
  }

  return (
    <form
      action={handleUpdate}
      className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
    >
      <input type="hidden" name="id" value={member.id} />

      <div>
        <label className="block font-medium mb-1 text-gray-500">
          Member Code (Read-Only)
        </label>
        <input
          name="member_code"
          defaultValue={member.member_code}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed outline-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1 text-gray-700">
            First Name
          </label>
          <input
            name="first_name"
            value={formData.first_name} // 3. Use 'value' instead of 'defaultValue'
            onChange={handleChange} // 4. Update local state
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1 text-gray-700">
            Last Name
          </label>
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-700">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Audit Footer */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 italic">
        <div>
          Last modified by:{" "}
          <span className="font-semibold text-gray-700">
            {member.last_modified_by || "System"}
          </span>
        </div>
        <div>
          {member.updated_at && (
            <span>
              Last updated: {new Date(member.updated_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="pt-6 flex items-center gap-4">
        <SubmitButton label="Update Member" />
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
