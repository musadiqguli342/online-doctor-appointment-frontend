"use client";

import { useState } from "react";
import { showToast } from "../utils/toast";
import "toastify-js/src/toastify.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginModal({ show, setShow }: any) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null; // 👈 important

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (res.ok) {
        showToast("Admin login successful!", "success", 9000);
        localStorage.setItem("role", "admin");
        localStorage.setItem("admin", "true");
        window.location.href = "/admin/add-doctor";
      } else {
        showToast("Invalid credentials!", "error", 9000);
      }
    } catch (error) {
      showToast("Something went wrong", "info", 9000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="bg-white rounded p-4" style={{ width: "400px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Admin Login</h5>
          <button className="btn-close" onClick={() => setShow(false)} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}