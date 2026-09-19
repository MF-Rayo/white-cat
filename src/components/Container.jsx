import { Home, Menu } from "lucide-react"
import logo from "@/assets/light.png"
import { useSidebarState } from "@/context/SidebarState"

export default function Container({ path, headerContent, children, className = "" }) {
  const { open, setOpen } = useSidebarState()

  return (
    <div className={`w-full h-full mx-auto flex flex-col overflow-hidden font-mono text-sm ${className}`}>     
      <div className="flex flex-row items-center justify-between gap-2 px-3 py-2 border-b border-(--border-color) select-none bg-(--bg-color)/90">
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <button onClick={() => setOpen(true)}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/80 shrink-0 cursor-pointer">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <img src={logo} className="w-9 h-9" alt="Logo" />
              <span className="!hidden lg:!inline-block text-[var(--text-color)] font-extrabold tracking-widest uppercase text-xl">
                {path}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerContent}
        </div>

      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-gradient-to-b via-[var(--kitty)]/40 to-[var(--kitty)]/70 text-white/90">
        {children}
      </div>
    </div>
  );
}