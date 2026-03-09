// src/app/layout.js
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";
import { Toaster } from "sonner";

export const metadata = {
  title: "MDM Portal",
  description: "Master Data Management System",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <div className="flex">
          {/* Sidebar stays fixed on the left */}
          <Sidebar />
          <Toaster position="top-right" />

          {/* Main content area scrolls on the right */}
          <main
            className={`flex-1 ${session ? "ml-64" : ""} p-8 bg-gray-50 min-h-screen`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
