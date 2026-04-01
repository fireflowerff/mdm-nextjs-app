"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function GroupSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // router.replace updates the URL without a full page reload
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search groups..."
        defaultValue={currentQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none border-gray-300"
      />
    </div>
  );
}
