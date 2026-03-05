// src/app/layout.js
import "./globals.css"; // <--- THIS IS THE MISSING LINK
import { Toaster } from "sonner";

export const metadata = {
  title: "MDM Master Data System",
  description: "Built on Next.js and PostgreSQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Sonner Toaster setup */}
        <Toaster richColors position="top-right" closeButton />

        {/* Your Page Content */}
        {children}
      </body>
    </html>
  );
}
