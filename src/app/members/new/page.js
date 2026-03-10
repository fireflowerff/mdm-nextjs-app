"use client";
import { createMember } from "@/lib/member-actions";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default function NewMemberPage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    // The SubmitButton automatically turns to "Processing..." here
    const result = await createMember(formData);

    if (result?.error) {
      // Show the Red Toast (stays until user clicks 'X')
      toast.error(result.error);
    } else {
      // 1. Show the Green Success Toast
      toast.success("Member created successfully!");

      // 2. Wait for 1.5 seconds so the user can see the message
      setTimeout(() => {
        router.push("/members");
        router.refresh(); // Refreshes the list to show the new record
      }, 1500);
    }
  }

  return (
    <div className="p-10 max-w-2xl">
      <Link href="/members" className="text-blue-500 hover:underline">
        ← Back to List
      </Link>
      <h1 className="text-3xl font-bold mb-6">Add New Member</h1>

      <form action={handleSubmit} className="space-y-4">
        {/* Member Code Field */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Member Code
          </label>
          <input
            name="member_code"
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. M001"
          />
        </div>

        {/* First & Last Name */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">
              First Name
            </label>
            <input
              name="first_name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">
              Last Name
            </label>
            <input
              name="last_name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* --- ADDED EMAIL FIELD BACK HERE --- */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="user@example.com"
          />
        </div>

        {/* Action Row */}
        <div className="pt-6 flex items-center gap-4">
          <SubmitButton label="Create Member" />
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
