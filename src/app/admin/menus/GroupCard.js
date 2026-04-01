"use client";

import Link from "next/link";
import MenuGroupForm from "./MenuGroupForm";

export default function GroupCard({ group, isSelected, searchTerm }) {
  return (
    <Link
      href={`?groupId=${group.id}${searchTerm ? `&q=${searchTerm}` : ""}`}
      className={`group block p-3 rounded-lg border transition-all relative ${
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
          : "border-gray-100 hover:bg-gray-50 text-gray-700"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-sm">{group.menu_name}</p>
          <p className="text-[10px] opacity-60 uppercase tracking-tight">
            {group.menu_code}
          </p>
        </div>

        {/* This div is now safe because it's inside a Client Component */}
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity z-50"
          onClick={(e) => {
            e.preventDefault(); // STOP THE LINK FROM NAVIGATING
            e.stopPropagation(); // STOP THE CLICK FROM BUBBLING
          }}
        >
          <MenuGroupForm initialData={group} />
        </div>
      </div>

      {isSelected && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full" />
      )}
    </Link>
  );
}
