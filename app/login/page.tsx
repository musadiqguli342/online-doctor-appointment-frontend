"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../../utils/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast("Login successful!", "success");
        const redirectAction = localStorage.getItem("redirectAction");
        const redirectDoctorId = localStorage.getItem("redirectDoctorId");
        const redirectSlot = localStorage.getItem("redirectSlot");
        setTimeout(() => {
          if (redirectAction === "review" && redirectDoctorId) {
            router.push(`/?openReview=${redirectDoctorId}`);
          } else if (
            redirectAction === "booking" &&
            redirectDoctorId &&
            redirectSlot
          ) {
            router.push(
              `/book-appointment?doctorId=${redirectDoctorId}&slot=${encodeURIComponent(
                redirectSlot,
              )}`,
            );
          } else {
            router.push("/book-appointment");
          }

          localStorage.removeItem("redirectAction");
          localStorage.removeItem("redirectDoctorId");
          localStorage.removeItem("redirectSlot");
        }, 500);
      } else {
        showToast(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center pt-5 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "420px", borderRadius: "12px" }}
      >
        {/* Form Heading */}
        <h2 className="text-center fw-semibold">Login</h2>
        <p className="text-center text-muted mt-2">
          Login to continue booking your appointment
        </p>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label fw-medium">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-3">
            <label className="form-label fw-medium">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-center mt-3">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </a>
          </p>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Link to signup page */}
        <p className="text-center text-muted mt-4 mb-0">
          Don’t have an account?{" "}
          <a href="/signup" className="fw-medium text-decoration-none">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
