"use client";

import { useState } from "react";
import { showToast } from "../utils/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginModal() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Admin login successful!", "success", 9000);
        localStorage.setItem("role", "admin");
        localStorage.setItem("admin", "true");

        // Redirect to admin page
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
    <div className="modal fade" id="adminLoginModal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Admin Login</h5>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
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
      </div>
    </div>
  );
}
