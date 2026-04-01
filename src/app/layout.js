// src/app/layout.js
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { getSidebarMenu } from "@/lib/menu"; // Import the fetcher we created

export const metadata = {
  title: "MDM Portal",
  description: "Master Data Management System",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  // 1. Determine the menu group to fetch.
  // In a real scenario, this would be session.user.menu_group_id.
  // For now, we'll default to '1' for ADMIN as per your sample data.
  let menuData = [];
  if (session) {
    const menuGroupId = session.user.menu_group_id;
    menuData = await getSidebarMenu(menuGroupId);
  }

  const userRole = session?.user?.role || "USER";

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex">
          {/* 2. Pass menuData into the Sidebar along with session and role */}
          {session && (
            <Sidebar
              session={session}
              userRole={userRole}
              menuData={menuData}
            />
          )}

          {/* Main content area */}
          <main className="flex-1 p-8">{children}</main>
        </div>

        {/* 3. Your Toast notifications configuration */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontSize: "18px",
              padding: "20px",
              width: "400px",
            },
          }}
        />
      </body>
    </html>
  );
}
