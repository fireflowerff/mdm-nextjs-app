"use client";

import { deleteMember } from "@/lib/member-actions";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteButton({ id, isAdmin }) {
  const [isPending, setIsPending] = useState(false);

  // If not admin, we show a disabled/grayed out version
  if (!isAdmin) {
    return (
      <button
        disabled
        className="text-gray-300 cursor-not-allowed px-2 py-1 text-sm"
      >
        Delete
      </button>
    );
  }

  async function handleDelete() {
    // Native browser confirmation (Simple & Effective)
    if (!confirm("Are you sure you want to archive this member?")) return;

    setIsPending(true);
    const result = await deleteMember(id);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Member moved to archive.");
    }
    setIsPending(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
        isPending
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200"
      }`}
    >
      {isPending ? "Archiving..." : "Delete"}
    </button>
  );
}
