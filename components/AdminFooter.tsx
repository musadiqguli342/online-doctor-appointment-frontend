"use client";

export default function AdminFooter() {
  return (
   <footer
  className="bg-dark text-white text-center py-3 mt-auto"
  style={{ marginLeft: "3px" }}
>
  © {new Date().getFullYear()} DocAppoint · Admin Panel
</footer>
  );
}
