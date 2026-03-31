"use client";
import { useState } from "react";
import { showToast } from "@/utils/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submitHandler = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/api/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    res.ok
      ? showToast(data.message, "success")
      : showToast(data.message, "error");
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <form
        onSubmit={submitHandler}
        className="card p-4 shadow"
        style={{ width: 420 }}
      >
        <h4 className="text-center mb-3">Forgot Password</h4>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Send Reset Link</button>
      </form>
    </div>
  );
}
