"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { showToast } from "../../utils/toast"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

export default function SignupPage() {
  const router = useRouter(); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      const res = await fetch(`${API_URL}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Signup successful! Please login.", "success");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
            showToast(data.message || "Signup failed", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  return (
    // Full-page container, vertically and horizontally centered
    <div className="container-fluid min-vh-100 d-flex align-items-center mt-5 justify-content-center bg-light px-3">
      
      {/* Card container for the signup form */}
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "16px" }}
      >
        {/* Form heading */}
        <h2 className="text-center fw-bold mb-4">Create Account</h2>

        {/* Signup form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="mb-3">
            <label className="form-label fw-medium">Full Name</label>
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label fw-medium">Email Address</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Phone Input */}
          <div className="mb-3">
            <label className="form-label fw-medium">Phone Number</label>
            <input
              name="phone"
              type="text"
              required
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="form-label fw-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Sign Up
          </button>
        </form>

        {/* Login redirect link */}
        <p className="text-center text-muted mt-4 mb-0">
          Already have an account?{" "}
          <a href="/login" className="fw-medium text-decoration-none">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
