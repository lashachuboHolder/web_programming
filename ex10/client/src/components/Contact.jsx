import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:3334'

function validateForm({ name, email, message }) {
  if (!name.trim()) return 'Name is required'
  if (!email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address'
  if (!message.trim()) return 'Message is required'
  return null
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (status?.type === 'error') setStatus(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validateForm(form)
    if (err) { setStatus({ type: 'error', text: err }); return }

    setLoading(true)
    try {
      await axios.post(`${API}/api/messages`, form)
      setStatus({ type: 'success', text: 'Message sent successfully! I\'ll get back to you soon.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Failed to send message. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-gray-900/40">
      <div className="max-w-xl mx-auto">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase text-center mb-3">
          Contact
        </p>
        <h2 className="text-4xl font-extrabold text-center mb-4">
          Get In{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Touch
          </span>
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Have a project in mind? I'd love to hear about it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Field label="Name">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={inputClass}
            />
          </Field>

          <Field label="Message">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell me about your project..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          {status && (
            <div
              className={`px-4 py-3 rounded-xl text-sm font-medium animate__animated animate__fadeIn ${
                status.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {status.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/20"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
