"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ session, menuData }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  // Recursive component to render menu items
  const NavItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = pathname === item.function_url;

    if (hasChildren) {
      return (
        <details
          className="group"
          open={pathname.startsWith(item.function_url || "!")}
        >
          <summary className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-800 text-gray-300 transition-colors list-none">
            <div className="flex items-center gap-3">
              <span className="text-lg">📁</span>
              <span className="font-medium">{item.display_name}</span>
            </div>
            <span className="text-xs transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="pl-6 mt-1 space-y-1 border-l border-gray-700 ml-4">
            {item.children.map((child) => (
              <NavItem key={child.id} item={child} />
            ))}
          </div>
        </details>
      );
    }

    return (
      <Link
        href={item.function_url || "#"}
        className={`flex items-center gap-3 p-3 rounded transition-all whitespace-nowrap ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <span className="text-lg">{isActive ? "🔹" : "📄"}</span>
        <span>{item.display_name}</span>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-xl"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 -translate-x-full"
        }`}
      >
        <div className="p-6 pt-16 text-xl font-bold border-b border-gray-800 text-blue-400 truncate">
          MDM {session?.user?.role || "Platform"}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuData?.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="mb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              User
            </p>
            <p className="text-sm font-medium truncate text-gray-300">
              {session?.user?.name}
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/api/auth/signout")}
            className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded border border-red-900/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Dynamic Spacer for Main Content */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ width: isOpen ? "256px" : "0px", flexShrink: 0 }}
      />
    </>
  );
}
