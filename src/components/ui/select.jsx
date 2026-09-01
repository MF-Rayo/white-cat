import { useState, useRef, useEffect } from "react"

export function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find(o => o.value === value) ?? options[0]

  // Cerrar al clickar fuera
  useEffect(() => {
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative min-w-[140px] rounded-[var(--radius-card,14px)]">

      <button 
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-1 rounded-(--radius-card,14px) 
          text-xs bg-(--card-bg) text-(--text-color) border transition-colors cursor-pointer
          ${open ? "border-(--primary-color)" : "border-(--primary-color)/30 hover:border-(--primary-color)/60"}`}
      >
        <span>{selected.label}</span>
        <svg
          className={`w-4 h-4 text-(--primary-color) transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-(--radius-card,14px)
          bg-(--bg-color) transition-shadow border
          max-h-60 overflow-y-auto">

          {options.map(opt => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`px-3 py-1 text-sm cursor-pointer transition-colors
                ${opt.value === value
                  ? "bg-(--primary-color) text-(--text-color) font-medium font-poppins"
                  : "text-(--text-color) hover:bg-(--text-color)/15"
                }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}