"use client";

import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/api/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast("Password reset successful", "success");
        setTimeout(() => {
          router.push("/book-appointment");
        }, 1500);
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow"
        style={{ width: 420 }}
      >
        <h4 className="text-center mb-3">Reset Password</h4>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100">Reset & Login</button>
      </form>
    </div>
  );
}
