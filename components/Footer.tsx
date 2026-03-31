// components/Footer.tsx
"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Logo & About */}
          <div className="col-12 col-md-3 mb-4">
            <h2 className="h5 fw-bold mb-2 text-white">MediBook</h2>
            <p className="text-secondary small">
              Connecting patients with top-rated doctors. Book appointments easily and securely.
            </p>
          </div>

          {/* Explore Links */}
          <div className="col-6 col-md-3 mb-4">
            <h5 className="text-white fw-semibold mb-3">Explore</h5>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><Link href="/" className="text-secondary text-decoration-none">Home</Link></li>
              </ul>
          </div>

          {/* Specialties */}
          <div className="col-6 col-md-3 mb-4">
            <h5 className="text-white fw-semibold mb-3">Specialties</h5>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><Link href="../../category/Cardiology" className="text-secondary text-decoration-none">Cardiology</Link></li>
              <li className="mb-2"><Link href="../../category/Neurology" className="text-secondary text-decoration-none">Neurology</Link></li>
              <li className="mb-2"><Link href="../../category/MentalHealth" className="text-secondary text-decoration-none">Mental Health</Link></li>
              <li className="mb-2"><Link href="../../category/SkinCare" className="text-secondary text-decoration-none">Skin Care</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-3 mb-4">
            <h5 className="text-white fw-semibold mb-3">Contact</h5>
            <p className="small mb-2">Email: <a href="mailto:support@medibook.com" className="text-secondary text-decoration-none">support@medibook.com</a></p>
            <p className="small mb-2">Phone: <a href="tel:+1234567890" className="text-secondary text-decoration-none">+1 234 567 890</a></p>
            <div className="d-flex gap-2 mt-2">
              <a href="#" className="text-secondary fs-5">🌐</a>
              <a href="#" className="text-secondary fs-5">🐦</a>
              <a href="#" className="text-secondary fs-5">📘</a>
              <a href="#" className="text-secondary fs-5">📸</a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-top border-secondary mt-4 pt-3 text-center small text-secondary">
          &copy; {new Date().getFullYear()} MediBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
