// NewMemberPage.js
"use client";
import { createMember } from "@/lib/member-actions";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

// Accept countries as a prop from the Server Page
export default function NewMemberPage({ countries }) {
  const router = useRouter();

  async function handleSubmit(formData) {
    const result = await createMember(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Member created successfully!");
      setTimeout(() => {
        router.push("/members");
        router.refresh();
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
        {/* --- COUNTRY LOV --- */}

        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Country
          </label>
          <input
            list="country-options"
            name="country_id_lookup"
            placeholder="Type to search country..."
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {
              // Find the ID based on the name typed
              const selected = countries.find(
                (c) => c.country_name === e.target.value,
              );
              if (selected) {
                document.getElementById("real_country_id").value = selected.id;
              }
            }}
          />
          <datalist id="country-options">
            {countries.map((country) => (
              <option key={country.id} value={country.country_name} />
            ))}
          </datalist>

          {/* Hidden input to actually submit the ID to the database */}
          <input type="hidden" name="country_id" id="real_country_id" />
        </div>
        <div className="pt-6 flex items-center gap-4">
          <SubmitButton label="Create Member" />
          <button type="button" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
