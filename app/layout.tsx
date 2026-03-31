"use client";

import "../styles/bootstrap-custom.scss";
import "toastify-js/src/toastify.css";
import Script from "next/script";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin"); // Detect admin route

  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        {/* Navbar only for non-admin pages */}
        {!isAdmin && <Navbar />}

        {/* Main content area */}
        <main className="pt-[72px] flex-grow-1 flex items-center justify-center bg-gray-50">
          {children}

          {/* Only show ChatBot on non-admin pages */}
          {!isAdmin && <ChatBot />}
        </main>

        {/* Footer only for non-admin pages */}
        {!isAdmin && <Footer />}

      </body>
    </html>
  );
}
