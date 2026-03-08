"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminFooter from "@/components/AdminFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content column */}
      <div
        className="d-flex flex-column"
        style={{
          marginLeft: "260px", // leave space for sidebar
          minHeight: "100vh",
        }}
      >
        {/* Scrollable content */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {children}
        </div>

        
      </div>
    </div>
    {/* Footer sticks to bottom of this column */}
        <AdminFooter />
        </>
  );
}
