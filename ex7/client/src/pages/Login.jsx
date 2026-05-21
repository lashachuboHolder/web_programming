import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-[#8257E5] text-[28px] font-bold tracking-wide text-center">User Management</h1>
          <span className="bg-[#E8C343] text-[#121214] px-3 py-1 rounded text-[13px] font-semibold">Hey, dev 👋</span>
        </div>

        <div className="bg-[#202024] rounded-lg w-full p-8">
          <h2 className="text-[#e1e1e6] text-xl font-semibold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#a8a8b3] font-medium">Email</label>
              <input
                className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#a8a8b3] font-medium">Password</label>
              <input
                className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-[#E83F5B] text-[13px] mt-2">{error}</p>}

            <button
              className="bg-[#8257E5] text-white border-none w-full py-3 text-[15px] mt-1 rounded-md cursor-pointer hover:bg-[#9466FF] transition-colors disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-5 text-[13px] text-[#a8a8b3]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8257E5] no-underline font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
