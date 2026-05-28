"use client"

import { useState } from "react"
import ParticleField from "@/components/landing/ParticleField"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    alert(data.message)

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{ background: "var(--dark)" }}
    >
      <style>{`.register-page .particle-field { position: absolute !important; z-index: 0; }`}</style>
      <div className="register-page absolute inset-0">
        <ParticleField />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md relative z-10"
        style={{
          background: "rgba(20, 20, 20, 0.86)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "48px 32px",
        }}
      >
        <style>{`
          .register-input {
            width: 100%;
            min-height: 44px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            background: rgba(26, 26, 26, 0.8);
            color: var(--text);
            padding: 12px 14px;
            font-family: var(--font-body);
            font-size: 0.95rem;
            transition: border-color 180ms ease, background 180ms ease;
          }
          .register-input::placeholder {
            color: var(--muted);
          }
          .register-input:hover {
            border-color: var(--acid);
            background: rgba(26, 26, 26, 0.95);
          }
          .register-input:focus {
            outline: none;
            border-color: var(--acid);
            background: rgba(26, 26, 26, 1);
            box-shadow: 0 0 12px rgba(200, 241, 53, 0.1);
          }
          .register-form-group {
            margin-bottom: 16px;
          }
        `}</style>

        <h1
          className="text-4xl font-bold text-center mb-6"
          style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
        >
          Create Account
        </h1>

        <p
          className="text-center mb-8"
          style={{
            color: "var(--muted-strong)",
            fontSize: "0.95rem",
            lineHeight: "1.5",
          }}
        >
          Join Finova and start tracking your money in motion
        </p>

        <div className="register-form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        <div className="register-form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        <div className="register-form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        <button
          type="submit"
          className="button button-primary w-full mt-6"
          style={{ minHeight: "44px" }}
        >
          {loading ? "Creating Account..." : "Start Tracking"}
        </button>
      </form>
    </div>
  )
}