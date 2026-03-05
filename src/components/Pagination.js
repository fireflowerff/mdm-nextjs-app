"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Helper to create the new URL with the updated page number
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-4 py-2 border rounded ${
          currentPage <= 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-gray-100"
        }`}
      >
        Previous
      </Link>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-4 py-2 border rounded ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-gray-100"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
