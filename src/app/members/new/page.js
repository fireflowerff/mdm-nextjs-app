"use client";
import { createMember } from "@/lib/member-actions";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewMemberPage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    const result = await createMember(formData);

    if (result?.error) {
      // If the DB returns an error (like duplicate key)
      toast.error(result.error);
    } else {
      // Success!
      toast.success("Member created successfully!");
      router.push("/members");
    }
  }

  return (
    <div className="p-10 max-w-2xl">
      <Link href="/members" className="text-blue-500 hover:underline">
        ← Back to List
      </Link>
      <h1 className="text-3xl font-bold mb-6">Add New Member</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Member Code</label>
          <input
            name="member_code"
            required
            className="w-full border p-2 rounded"
            placeholder="e.g. M005"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">First Name</label>
            <input
              name="first_name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Last Name</label>
            <input
              name="last_name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold"
        >
          Save Member
        </button>
      </form>
    </div>
  );
}
