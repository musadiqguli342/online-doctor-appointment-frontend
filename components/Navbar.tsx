"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLoginModal from "../components/AdminLoginModel";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ Check admin login status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("role") === "admin");
    }
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pathname !== "/") {
      router.push(`/?q=${encodeURIComponent(search)}`);
    } else {
      router.replace(`/?q=${encodeURIComponent(search)}`);
    }
  };

  // ✅ FIXED LOGOUT
 const handleLogout = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("admin");
  setIsAdmin(false);
  router.push("/");
};


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            DoctorApp
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
       <ul className="navbar-nav me-auto gap-3">
  <li className="nav-item">
    <Link href="/" className="nav-link text-white fw-semibold">
      Home
    </Link>
  </li>

  <li className="nav-item">
                <Link
                  href="/category/Cardiology"
                  className="nav-link text-white fw-semibold"
                >
                  Cardiology
                </Link>
              </li>

  <li className="nav-item">
    <Link href="/category/MentalHealth" className="nav-link text-white fw-semibold">
      Mental Health
    </Link>
  </li>
  <li className="nav-item">
    <Link href="/category/Neurology" className="nav-link text-white fw-semibold">
      Neurology
    </Link>
  </li>

  <li className="nav-item">
    <Link href="/category/SkinCare" className="nav-link text-white fw-semibold">
      Skin Care
    </Link>
  </li>
</ul>


            {/* 🔐 Admin buttons */}
            <ul className="navbar-nav">
              <li className="nav-item">
                {isAdmin ? (
                  <button
                    className="btn btn-outline-light rounded-pill px-4"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-light rounded-pill px-4"
                    data-bs-toggle="modal"
                    data-bs-target="#adminLoginModal"
                  >
                    Admin Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ Admin Login Modal */}
      <AdminLoginModal />
    </>
  );
}
