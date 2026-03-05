"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // This updates the URL without a full page reload
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4">
      <input
        className="border p-2 rounded w-full md:w-1/3"
        placeholder="Search by Member Code or Name..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
