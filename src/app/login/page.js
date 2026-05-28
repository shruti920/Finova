"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, LogIn } from "lucide-react"
import ParticleField from "@/components/landing/ParticleField"

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })

    if (res.error) {
      setError(res.error)
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          var(--dark)
        `,
        backgroundSize: "52px 52px",
      }}
    >
      <style>{`.login-page .particle-field { position: absolute !important; z-index: 0; }`}</style>
      <div className="login-page absolute inset-0">
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
          backdropFilter: "blur(8px)",
        }}
      >
        <style>{`
          .login-input {
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
          .login-input::placeholder {
            color: var(--muted);
          }
          .login-input:hover {
            border-color: var(--acid);
            background: rgba(26, 26, 26, 0.95);
          }
          .login-input:focus {
            outline: none;
            border-color: var(--acid);
            background: rgba(26, 26, 26, 1);
            box-shadow: 0 0 12px rgba(200, 241, 53, 0.1);
          }
          .login-form-group {
            margin-bottom: 16px;
          }
          .login-button {
            width: 100%;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            border-radius: var(--radius);
            background: var(--acid);
            color: var(--dark);
            font-family: var(--font-body);
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 180ms ease;
            box-shadow: 0 0 28px rgba(200, 241, 53, 0.2);
          }
          .login-button:hover:not(:disabled) {
            background: #e0b800;
            box-shadow: 0 0 40px rgba(200, 241, 53, 0.4);
            transform: translateY(-2px);
          }
          .login-button:active:not(:disabled) {
            transform: translateY(0);
          }
          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .login-error {
            padding: 12px;
            border-radius: var(--radius);
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            font-size: 0.85rem;
            margin-bottom: 16px;
          }
        `}</style>

        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-center mb-2"
            style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h1>
          <p
            className="text-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            Sign in to access your financial hub
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="login-form-group">
          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: "var(--muted-strong)" }}
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleChange}
            value={formData.email}
            className="login-input"
            required
          />
        </div>

        <div className="login-form-group">
          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: "var(--muted-strong)" }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={formData.password}
            className="login-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="login-button mt-6"
        >
          {loading ? (
            <>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Sign In</span>
            </>
          )}
        </button>

        <div
          className="mt-6 pt-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold transition"
              style={{ color: "var(--acid)" }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.target.style.textDecoration = "none")
              }
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}