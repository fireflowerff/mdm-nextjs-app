"use client";

import { toast } from "sonner";

export default function MenuDeleteButton({ id, onDelete, label = "" }) {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Are you sure you want to delete ${label}?`)) {
      const res = await onDelete(id);
      if (res.success) {
        toast.success("Deleted successfully");
      } else {
        toast.error(res.error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
      title="Delete"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9 2 2 4-4" />
      </svg>
    </button>
  );
}
