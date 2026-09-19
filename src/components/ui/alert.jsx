import { useEffect, useState } from "react"
import { Info, Check, TriangleAlert, CircleX} from "lucide-react"


const icons = {
  success: (<Check/>),
  warning: (<TriangleAlert/>),
  danger: (<CircleX/>),
  info: (<Info/>),
}

const colors = {
  success: "text-(--success-color) bg-(--bg-color) border-(--success-color)",
  warning: "text-(--warning-color) bg-(--bg-color) border-(--warning-color)",
  danger:  "text-(--danger-color)  bg-(--bg-color) border-(--danger-color)",
  info:    "text-(--info-color)    bg-(--bg-color) border-(--info-color)",
}

export function Alert({ id, type = "info", message, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose(id), 400)
  }

  // Auto-cerrar a los 10s
  useEffect(() => {
    const t = setTimeout(handleClose, 10000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={` relative flex items-center gap-3 px-4 py-3 border rounded-sm overflow-hidden
        font-mono text-xs font-medium tracking-wide transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${colors[type]}
        ${visible ? "translate-x-0 opacity-100" : "translate-x-[calc(100%+24px)] opacity-0"}
      `}
    >
  
      <span className="absolute left-0 top-0 bottom-0 w-3px bg-current" />
    
      <span className="absolute top-0 left-3px right-0 h-px bg-current opacity-15" />

      <span className="shrink-0">{icons[type]}</span>

      <span className="flex-1 leading-relaxed opacity-90">{message}</span>

      <button
        onClick={handleClose}
        className="shrink-0 ml-auto px-1 opacity-45 hover:opacity-100 transition-opacity text-base leading-none"
      >
        ×
      </button>
    </div>
  )
}