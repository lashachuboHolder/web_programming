import { useState } from 'react'
import './Accordion.css'

function ChevronUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export { ChevronUp, ChevronDown }

export default function Accordion({ items }) {
  const [openIds, setOpenIds] = useState(new Set())

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <div key={item.id} className="accordion-item">
            <button className="accordion-header" onClick={() => toggle(item.id)}>
              <span className="accordion-title">{item.title}</span>
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            <hr />
            {isOpen && (
              <div className="accordion-content">
                <p>{item.content}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
