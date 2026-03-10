// src/app/layout.js
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";
import { Toaster } from "sonner"; // 1. Add this import

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
          {/* Our dynamic sidebar we built earlier */}
          <Sidebar />

          {/* Main content area: ml-64 shifts it only if sidebar is visible */}
          <main
            className={`flex-1 ${session ? "ml-64" : ""} p-8 bg-gray-50 min-h-screen`}
          >
            {children}
          </main>
        </div>

        {/* 2. Add the Toaster here, at the very bottom of the body */}
        {/* 'richColors' makes Success green and Error red automatically */}
        <Toaster
          position="top-right" // Moves it to the top right
          richColors // Keeps the Red/Green colors
          closeButton // Adds an 'X' to close it
          toastOptions={{
            style: {
              fontSize: "18px", // Makes the text bigger
              padding: "20px", // Adds space around the text
              width: "400px", // Makes the box wider for long errors
            },
          }}
        />
      </body>
    </html>
  );
}
