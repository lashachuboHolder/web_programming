import React from 'react'

export default function Modal({ title, onClose, children }) {
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#202024] rounded-[10px] p-7 w-full max-w-[480px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[#2a2a2e]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#e1e1e6] text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[#a8a8b3] text-lg cursor-pointer px-2 py-1 rounded leading-none hover:text-[#e1e1e6]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3.5">
          {children}
        </div>
      </div>
    </div>
  )
}
