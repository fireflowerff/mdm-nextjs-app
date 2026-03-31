"use client"; // Now a Client Component to handle state
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // For the breadcrumb feature later

export default function Sidebar({ session, userRole }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const MENU_ITEMS = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      roles: ["ADMIN", "USER"],
    },
    {
      label: "Countries",
      href: "/countries",
      icon: "🗺️",
      roles: ["ADMIN", "USER"],
    },
    {
      label: "Member",
      href: "/members",
      icon: "🔍",
      roles: ["ADMIN", "USER"],
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: "👥",
      roles: ["ADMIN"],
    },
    {
      label: "Master Data (LOV)",
      href: "/admin/lov",
      icon: "⚙️",
      roles: ["ADMIN"],
    },
  ];

  return (
    <>
      {/* 1. The Floating Toggle Button (Breadcrumb Style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-xl"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* 2. The Sidebar Container */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 z-40
          ${isOpen ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none -translate-x-full"}
        `}
      >
        <div className="p-6 pt-16 text-xl font-bold border-b border-gray-800 text-blue-400 whitespace-nowrap overflow-hidden">
          MDM Admin Role
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
          {MENU_ITEMS.filter((item) => item.roles.includes(userRole)).map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ),
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 overflow-hidden">
          <div className="mb-4 whitespace-nowrap">
            <p className="text-xs text-gray-500 uppercase">Logged in as</p>
            <p className="text-sm font-medium truncate">
              {session?.user?.name}
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/api/auth/signout")} // Simple client-side logout
            className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded border border-transparent hover:border-red-900/50"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* 3. Main Content Spacer: This pushes your page content when menu is open */}
      {/* THIS IS THE KEY: The Dynamic Spacer */}
      <div
        className={`transition-all duration-300 ease-in-out`}
        style={{ width: isOpen ? "256px" : "0px", flexShrink: 0 }}
      />
    </>
  );
}
