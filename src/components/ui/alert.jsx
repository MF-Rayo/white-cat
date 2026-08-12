import { useEffect, useState } from "react"

const icons = {
  success: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  warning: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  danger: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
}

const colors = {
  success: "text-(--success-color) bg-[color-mix(in_srgb,var(--card-bg)_92%,var(--success-color)_8%)] border-(--success-color)",
  warning: "text-(--warning-color) bg-[color-mix(in_srgb,var(--card-bg)_92%,var(--warning-color)_8%)] border-(--warning-color)",
  danger:  "text-(--danger-color)  bg-[color-mix(in_srgb,var(--card-bg)_92%,var(--danger-color)_8%)]  border-(--danger-color)",
  info:    "text-(--info-color)    bg-[color-mix(in_srgb,var(--card-bg)_92%,var(--info-color)_8%)]    border-(--info-color)",
}

export function Alert({ id, type = "info", message, onClose }) {
  const [visible, setVisible] = useState(false)

  // Entrada
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose(id), 400)
  }

  // Auto-cerrar a los 4s
  useEffect(() => {
    const t = setTimeout(handleClose, 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3
        border rounded-sm overflow-hidden
        font-mono text-xs font-medium tracking-wide
        transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${colors[type]}
        ${visible ? "translate-x-0 opacity-100" : "translate-x-[calc(100%+24px)] opacity-0"}
      `}
    >
      {/* Barra lateral izquierda */}
      <span className="absolute left-0 top-0 bottom-0 w-3px bg-current" />
      {/* Línea superior */}
      <span className="absolute top-0 left-3px right-0 h-px bg-current opacity-15" />

      {/* Icono */}
      <span className="shrink-0">{icons[type]}</span>

      {/* Mensaje */}
      <span className="flex-1 leading-relaxed opacity-90">{message}</span>

      {/* Cerrar */}
      <button
        onClick={handleClose}
        className="shrink-0 ml-auto px-1 opacity-45 hover:opacity-100 transition-opacity text-base leading-none"
      >
        ×
      </button>
    </div>
  )
}