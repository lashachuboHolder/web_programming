import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App.jsx'
import Navbar from '../components/Navbar.jsx'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    try {
      const res = await axios.get('/api/auth/me')
      setProfile(res.data)
      setUsername(res.data.username)
      setEmail(res.data.email)
    } catch {}
  }

  async function handleSave(e) {
    e.preventDefault()
    setEditError('')
    setEditSuccess('')
    setEditLoading(true)
    try {
      const res = await axios.put('/api/auth/me', {
        username: username.trim() || profile.username,
        email: email.trim() || profile.email,
        ...(password.trim() ? { password: password.trim() } : {}),
      })
      setProfile(res.data)
      setUsername(res.data.username)
      setEmail(res.data.email)
      setPassword('')
      updateUser(res.data)
      setEditSuccess('Profile updated successfully!')
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setEditLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setDeleteLoading(true)
    try {
      await axios.delete('/api/auth/me')
      logout()
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete account')
      setDeleteLoading(false)
    }
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-[#a8a8b3]">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="px-8 py-8 max-w-[960px] mx-auto">
        <div className="grid grid-cols-[1fr_1.5fr] gap-6">
          <div className="bg-[#202024] rounded-lg p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#e1e1e6] pb-3 border-b border-[#2a2a2e]">My Profile</h2>

            <div className="flex justify-center">
              <div className="w-[72px] h-[72px] rounded-full bg-[#8257E5] flex items-center justify-center text-[28px] font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col gap-1 py-2.5 border-b border-[#2a2a2e]">
              <span className="text-[12px] text-[#a8a8b3] uppercase tracking-wide font-semibold">Username</span>
              <span className="text-[15px] text-[#e1e1e6]">{profile.username}</span>
            </div>
            <div className="flex flex-col gap-1 py-2.5 border-b border-[#2a2a2e]">
              <span className="text-[12px] text-[#a8a8b3] uppercase tracking-wide font-semibold">Email</span>
              <span className="text-[15px] text-[#e1e1e6]">{profile.email}</span>
            </div>
            <div className="flex flex-col gap-1 py-2.5 border-b border-[#2a2a2e]">
              <span className="text-[12px] text-[#a8a8b3] uppercase tracking-wide font-semibold">Role</span>
              <span className={`inline-block w-fit px-2 py-0.5 rounded text-xs ${profile.role === 'admin' ? 'bg-[#8257E5] text-white' : 'bg-[#3a3a3e] text-[#e1e1e6]'}`}>
                {profile.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-2.5 border-b border-[#2a2a2e]">
              <span className="text-[12px] text-[#a8a8b3] uppercase tracking-wide font-semibold">Member since</span>
              <span className="text-[15px] text-[#e1e1e6]">{new Date(profile.created_at).toLocaleDateString('en-US')}</span>
            </div>

            {profile.role !== 'admin' && (
              <button
                className="bg-[#E83F5B] text-white border-none w-full py-2.5 rounded-md cursor-pointer text-sm hover:bg-[#FF5070] transition-colors disabled:opacity-60 mt-2"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            )}
          </div>

          <div className="bg-[#202024] rounded-lg p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#e1e1e6] pb-3 border-b border-[#2a2a2e]">Edit Profile</h2>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-[#a8a8b3] font-medium">Username</label>
                <input
                  className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-[#a8a8b3] font-medium">Email</label>
                <input
                  className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-[#a8a8b3] font-medium">
                  New password <span className="text-[#666] text-[12px]">(optional)</span>
                </label>
                <input
                  className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {editError && <p className="text-[#E83F5B] text-[13px] mt-2">{editError}</p>}
              {editSuccess && <p className="text-[#04D361] text-[13px] mt-2">{editSuccess}</p>}

              <button
                className="bg-[#8257E5] text-white border-none self-start px-7 py-2.5 rounded-md cursor-pointer text-sm hover:bg-[#9466FF] transition-colors disabled:opacity-60"
                type="submit"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
