// src/components/Sidebar.js
import Link from "next/link";
import { auth, signOut } from "@/auth";

const MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/members",
    icon: "📊",
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Member Search",
    href: "/members/search",
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

export default async function Sidebar() {
  const session = await auth();
  if (!session) return null;

  const userRole = session?.user?.role || "USER";

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-xl font-bold border-b border-gray-800 text-blue-400">
        MDM Portal
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.filter((item) => item.roles.includes(userRole)).map(
          (item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ),
        )}
      </nav>

      {/* User Info & Logout Area */}
      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Logged in as
          </p>
          <p className="text-sm font-medium truncate">{session.user.name}</p>
          <span className="text-[10px] px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded-full border border-blue-800">
            {userRole}
          </span>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded transition-all border border-transparent hover:border-red-900/50">
            <span>🚪</span> Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
