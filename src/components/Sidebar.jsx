import { ChevronLeft, ChevronDown } from "lucide-react"
import logo from "../assets/light.png"
import { createContext, useContext, useState } from "react"
import { useSidebarState } from "@/context/SidebarState"

const SidebarItemsContext = createContext()

export function SidebarCategory({ icon, text, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <li className="mb-1">
            <div
                onClick={() => setOpen((curr) => !curr)}
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="flex items-center justify-between py-2.5 px-2 rounded-[var(--radius-card,14px)] cursor-pointer select-none
                        text-(--text-secondary) hover:text-(--text-color) hover:bg-(--primary-color)/10 transition-all duration-100"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-medium whitespace-nowrap">{text}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </div>

            <ul className={`overflow-hidden transition-all duration-300 pl-4 ml-3 border-l border-(--border-color)
                            ${open ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                {children}
            </ul>
        </li>
    )
}

export default function Sidebar({ children, footer }) {
    const { open, setOpen, isMobile } = useSidebarState()

    const closeIfMobile = () => { if (isMobile) setOpen(false) }

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
            )}

            <aside className={`fixed z-50 top-0 left-0 h-screen flex flex-col
                ${isMobile ? "w-[85%] max-w-72" : "w-72"} bg-(--bg-color)/90 
                backdrop-blur-xl border-r border-(--border-color)
                transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-3 pb-1 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={logo} className="w-9 h-9" alt="Logo" />
                        <span className="text-(--text-color) font-extrabold tracking-widest uppercase text-xl">White Cat</span>
                    </div>

                    <button onClick={() => setOpen(false)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/80 shrink-0 cursor-pointer">
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <SidebarItemsContext.Provider value={{ closeMenu: closeIfMobile }}>
                    <ul className="flex-1 px-3 mt-2 overflow-y-auto overflow-x-hidden min-h-0">{children}</ul>
                    <ul className="px-3 m-0 list-none mb-3">{footer}</ul>
                </SidebarItemsContext.Provider>
            </aside>
        </>
    )
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
    const { closeMenu } = useContext(SidebarItemsContext)

    return (
        <li
            onClick={(e) => {
                if (onClick) onClick(e)
                closeMenu?.()
            }}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className={`
                flex items-center gap-3 py-2.5 px-3 rounded-[var(--radius-card,14px)]
                cursor-pointer transition-all duration-100 select-none
                ${active
                    ? "text-(--primary-color) bg-(--primary-color)/10"
                    : "text-(--text-secondary) hover:text-(--text-color) hover:bg-(--primary-color)/10"
                }
            `}
        >
            <div className="relative">
                {icon}
                {alert && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-(--primary-color)" />}
            </div>
            <span className="font-medium whitespace-nowrap">{text}</span>
        </li>
    )
}