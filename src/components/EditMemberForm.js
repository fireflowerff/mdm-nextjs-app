// components/EditMemberForm.js
"use client";

import { useState } from "react";
import { updateMember } from "@/lib/member-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default function EditMemberForm({ member, countries }) {
  const router = useRouter();

  // Find the initial country name based on the member's country_id
  const initialCountry = countries.find((c) => c.id === member.country_id);

  const [formData, setFormData] = useState({
    first_name: member.first_name,
    last_name: member.last_name,
    email: member.email,
    // Use the joined name directly from the member object
    country_name: member.country_name || "",
    country_id: member.country_id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country_search") {
      // Logic for the Datalist: Find the ID when the name matches
      const match = countries.find((c) => c.country_name === value);
      setFormData((prev) => ({
        ...prev,
        country_name: value,
        country_id: match ? match.id : prev.country_id,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleUpdate(formRawData) {
    // Append the hidden country_id to ensure it's sent
    formRawData.set("country_id", formData.country_id);

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
      <input type="hidden" name="country_id" value={formData.country_id} />

      {/* Country Datalist Search */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-gray-700">
          Country (Search)
        </label>
        <input
          list="country-list"
          name="country_search"
          value={formData.country_name}
          onChange={handleChange}
          placeholder="Start typing a country..."
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          autoComplete="off"
        />
        <datalist id="country-list">
          {countries.map((c) => (
            <option key={c.id} value={c.country_name} />
          ))}
        </datalist>
        <p className="text-xs text-gray-400 mt-1">
          Internal ID: {formData.country_id || "None"}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1 text-gray-700">
            First Name
          </label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
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
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
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
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
