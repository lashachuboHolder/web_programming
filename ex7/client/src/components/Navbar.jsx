import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-[#202024] border-b border-[#2a2a2e] px-8 h-[60px] flex items-center justify-between">
      <span className="text-[#8257E5] font-bold text-lg tracking-wide">User Management</span>
      <div className="flex items-center gap-5">
        {user && (
          <span className="text-[#a8a8b3] text-sm">
            Hello, <strong>{user.username}</strong>
          </span>
        )}
        <Link to="/profile" className="text-[#e1e1e6] no-underline text-sm px-3 py-1.5 rounded-md hover:bg-[#2a2a2e] transition-colors">
          Profile
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-[#e1e1e6] no-underline text-sm px-3 py-1.5 rounded-md hover:bg-[#2a2a2e] transition-colors">
            Admin
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-transparent border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-1.5 rounded-md cursor-pointer text-sm hover:bg-[#2a2a2e] transition-colors"
        >
          Log Out
        </button>
      </div>
    </nav>
  )
}
