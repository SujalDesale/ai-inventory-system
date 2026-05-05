// 

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext.jsx"
import { useLocation, useNavigate } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [err, setErr] = useState("")
  const nav = useNavigate()
  const loc = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(form)
      const to = loc.state?.from?.pathname || "/dashboard"
      nav(to, { replace: true })
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              required
            />
          </div>

          {err && (
            <div className="text-red-400 text-sm text-center">{err}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-300 shadow-lg"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
