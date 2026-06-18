import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3334'

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function MessageCard({ msg }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate__animated animate__fadeInUp">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-white">{msg.name}</p>
          <p className="text-violet-400 text-sm truncate">{msg.email}</p>
        </div>
        <time className="text-xs text-gray-600 shrink-0 mt-0.5">{formatDate(msg.createdAt)}</time>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{msg.message}</p>
    </div>
  )
}

export default function Messages() {
  const [visible, setVisible] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function fetchMessages(p = 1) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(`${API}/api/messages?page=${p}&limit=5`)
      setMessages(data.messages)
      setTotalPages(data.pages)
      setTotal(data.total)
      setPage(p)
    } catch {
      setError('Failed to load messages. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) fetchMessages(1)
  }, [visible])

  return (
    <section className="py-16 px-6 border-t border-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => setVisible(v => !v)}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-full text-sm font-semibold text-gray-300 hover:text-white transition-all"
          >
            {visible ? 'Hide Inbox' : 'View Received Messages'}
          </button>
        </div>

        {visible && (
          <div className="animate__animated animate__fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                Inbox
                {total > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">({total} messages)</span>
                )}
              </h3>
              <button
                onClick={() => fetchMessages(page)}
                disabled={loading}
                className="text-xs text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading && (
              <div className="text-center text-gray-400 py-12">Loading messages…</div>
            )}

            {error && (
              <div className="text-center py-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && messages.length === 0 && (
              <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                No messages yet.
              </div>
            )}

            {!loading && messages.length > 0 && (
              <div className="space-y-4">
                {messages.map(msg => (
                  <MessageCard key={msg._id} msg={msg} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => fetchMessages(page - 1)}
                  disabled={page <= 1 || loading}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-gray-400 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchMessages(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
