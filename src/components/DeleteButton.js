"use client";

import { deleteMember } from "@/lib/member-actions";
import { toast } from "sonner"; // Import from sonner
import { useState } from "react";

export default function DeleteButton({ id, isAdmin }) {
  const [isPending, setIsPending] = useState(false);

  if (!isAdmin) return null;

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;

    setIsPending(true);

    // Start the toast immediately with a loading state
    const promise = deleteMember(id);

    toast.promise(promise, {
      loading: "Archiving member...",
      success: "Member archived successfully",
      error: (err) => err.message || "Failed to delete member",
    });

    await promise;
    setIsPending(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-sm font-medium transition-colors ${
        isPending ? "text-gray-400" : "text-red-600 hover:text-red-800"
      }`}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
