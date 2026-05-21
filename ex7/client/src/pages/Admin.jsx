import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../App.jsx'
import Navbar from '../components/Navbar.jsx'
import Modal from '../components/Modal.jsx'

const emptyForm = { username: '', email: '', password: '', role: 'user' }

export default function Admin() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [tableError, setTableError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await axios.get('/api/users')
      setUsers(res.data)
    } catch (err) {
      setTableError(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditTarget(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(u) {
    setEditTarget(u)
    setForm({ username: u.username, email: u.email, password: '', role: u.role })
    setFormError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
    setForm(emptyForm)
    setFormError('')
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      if (editTarget) {
        const body = { username: form.username, email: form.email, role: form.role }
        if (form.password.trim()) body.password = form.password.trim()
        await axios.put(`/api/users/${editTarget.id}`, body)
      } else {
        await axios.post('/api/users', {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        })
      }
      closeModal()
      fetchUsers()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save user')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Are you sure you want to delete user "${u.username}"?`)) return
    try {
      await axios.delete(`/api/users/${u.id}`)
      setUsers(prev => prev.filter(x => x.id !== u.id))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user')
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-8 py-8 max-w-[1100px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[22px] font-bold text-[#e1e1e6]">User Administration</h1>
          <button
            className="bg-[#8257E5] text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-sm hover:bg-[#9466FF] transition-colors"
            onClick={openCreate}
          >
            + New User
          </button>
        </div>

        {tableError && <p className="text-[#E83F5B] text-[13px] mb-4">{tableError}</p>}

        <div className="bg-[#202024] rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <p className="text-[#a8a8b3]">Loading...</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['ID', 'Username', 'Email', 'Role', 'Created at', 'Actions'].map(h => (
                    <th key={h} className="bg-[#8257E5] text-white px-4 py-3 text-left text-sm font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-[#a8a8b3] p-6">No users found</td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={u.id} className={`hover:bg-[#1a1a1e] transition-colors ${idx % 2 === 1 ? 'bg-[#1a1a1e]' : ''}`}>
                      <td className="px-4 py-2.5 border-b border-[#2a2a2e] text-[#a8a8b3] font-mono">#{u.id}</td>
                      <td className="px-4 py-2.5 border-b border-[#2a2a2e] font-medium">{u.username}</td>
                      <td className="px-4 py-2.5 border-b border-[#2a2a2e] text-[#a8a8b3]">{u.email}</td>
                      <td className="px-4 py-2.5 border-b border-[#2a2a2e]">
                        <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-[#8257E5] text-white' : 'bg-[#3a3a3e] text-[#e1e1e6]'}`}>
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 border-b border-[#2a2a2e] text-[#a8a8b3]">
                        {new Date(u.created_at).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-4 py-2.5 border-b border-[#2a2a2e]">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => openEdit(u)}
                            className="bg-transparent border border-[#3a3a3e] rounded-md px-2.5 py-1.5 cursor-pointer text-sm hover:bg-[#2a2a2e] transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="bg-transparent border border-[#3a3a3e] rounded-md px-2.5 py-1.5 cursor-pointer text-sm hover:bg-[#2a2a2e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Delete"
                            disabled={u.id === currentUser?.id}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editTarget ? 'Edit User' : 'New User'} onClose={closeModal}>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#a8a8b3] font-medium">Username</label>
              <input
                className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                name="username"
                type="text"
                placeholder="username"
                value={form.username}
                onChange={handleFormChange}
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#a8a8b3] font-medium">Email</label>
              <input
                className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                name="email"
                type="email"
                placeholder="user@email.com"
                value={form.email}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#a8a8b3] font-medium">
                Password{editTarget && <span className="text-[#666] text-[12px]"> (optional when editing)</span>}
              </label>
              <input
                className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5]"
                name="password"
                type="password"
                placeholder={editTarget ? 'Leave blank to keep current' : '••••••••'}
                value={form.password}
                onChange={handleFormChange}
                {...(!editTarget ? { required: true } : {})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#a8a8b3] font-medium">Role</label>
              <select
                className="bg-[#2a2a2e] border border-[#3a3a3e] text-[#e1e1e6] px-3.5 py-2.5 rounded-md text-sm w-full focus:outline-none focus:border-[#8257E5] cursor-pointer"
                name="role"
                value={form.role}
                onChange={handleFormChange}
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {formError && <p className="text-[#E83F5B] text-[13px] mt-2">{formError}</p>}

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-transparent border border-[#3a3a3e] text-[#e1e1e6] px-5 py-2.5 rounded-md cursor-pointer text-sm hover:bg-[#2a2a2e] transition-colors"
              >
                Cancel
              </button>
              <button
                className="bg-[#8257E5] text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-sm hover:bg-[#9466FF] transition-colors disabled:opacity-60"
                type="submit"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : (editTarget ? 'Save' : 'Create')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
