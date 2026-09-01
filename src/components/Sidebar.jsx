import { ChevronFirst, ChevronLast, ChevronDown, Menu, X } from "lucide-react"
import logo from "../assets/light.png"
import { createPortal } from "react-dom"
import { createContext, useContext, useState, useEffect, useRef } from "react"

const SidebarContext = createContext();

export function SidebarCategory({ icon, text, children, defaultOpen = false }) {
    const ctx = useContext(SidebarContext)
    const { expanded } = ctx
    const [open, setOpen] = useState(defaultOpen)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [flyoutOpen, setFlyoutOpen] = useState(false)
    const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 })
    const itemRef = useRef(null)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!expanded && !isMobile) setOpen(false)
    }, [expanded, isMobile])

    const showLabel = expanded || isMobile
    const collapsed = !showLabel

    const handleMouseEnter = () => {
        if (!collapsed || !itemRef.current) return
        const rect = itemRef.current.getBoundingClientRect()
        setFlyoutPos({ top: rect.top, left: rect.right })
        setFlyoutOpen(true)
    }

    const handleMouseLeave = () => setFlyoutOpen(false)

    return (
        <li
            className="mb-1 relative"
            ref={itemRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                onClick={() => {
                    if (collapsed) return
                    setOpen((curr) => !curr)
                }}
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="flex items-center justify-between py-2.5 px-2 rounded-lg cursor-pointer select-none
                        text-(--text-secondary) hover:text-(--text-color) hover:bg-(--primary-color)/10 transition-all duration-100"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    {showLabel && <span className="font-medium whitespace-nowrap">{text}</span>}
                </div>
                {showLabel && (
                    <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                )}
            </div>

            {showLabel && (
                <ul
                    className={`overflow-hidden transition-all duration-300 pl-4 ml-3 border-l border-(--border-color)
                                ${open ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                >
                    {children}
                </ul>
            )}

            {collapsed && flyoutOpen && createPortal(
                <div
                    style={{ position: "fixed", top: flyoutPos.top, left: flyoutPos.left }}
                    className="min-w-[180px] rounded-lg bg-(--bg-color)/90 backdrop-blur-xl overflow-hidden z-[9999] py-1
                            shadow-lg border border-(--border-color) animate-fadeIn"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="px-3 py-2 text-(--text-color) text-sm font-semibold whitespace-nowrap border-b border-(--border-color)">
                        {text}
                    </div>
                    <ul className="py-1 px-1">
                        <SidebarContext.Provider value={{ ...ctx, expanded: true }}>
                            {children}
                        </SidebarContext.Provider>
                    </ul>
                </div>,
                document.body
            )}
        </li>
    )
}


export default function Sidebar({ children, footer }) {
    const [expanded, setExpanded] = useState(true)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (!mobile) {
                setMobileMenuOpen(false)
                setExpanded(true)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (isMobile) {
        return (
            <>
                <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-(--bg-color)/60 backdrop-blur-xl border-b border-(--border-color) flex items-center justify-between px-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-(--card-bg) text-(--text-color) transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <img src={logo} className="w-8 h-8" alt="Logo" />
                        <span className="text-(--text-color) font-extrabold tracking-widest uppercase text-lg whitespace-nowrap">
                            WHITE CAT
                        </span>
                    </div>
                    
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {mobileMenuOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40 bg-black/50"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div className="fixed top-14 left-0 right-0 bottom-0 z-40 bg-(--bg-color)/95 backdrop-blur-xl overflow-y-auto animate-slideDown">
                            <SidebarContext.Provider value={{ expanded: true, closeMobileMenu: () => setMobileMenuOpen(false) }}>
                                <ul className="flex flex-col p-4 space-y-1">
                                    {children}
                                </ul>
                                {footer && (
                                    <ul className="p-4 pt-0 border-t border-(--border-color) mt-auto">
                                        {footer}
                                    </ul>
                                )}
                            </SidebarContext.Provider>
                        </div>
                    </>
                )}
            </>
        )
    }

    // Desktop 
    return (
        <>
            <aside className="h-[100vh] py-2 z-100 pl-2 flex flex-col justify-center shrink-0">
                <nav className="h-full flex flex-col bg-(--bg-color)/60 backdrop-blur-xl rounded-xl">
                    <div className="p-2 pb-1 flex justify-between items-center">
                        <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-12" : "w-0"}`} />
                        
                        <span className={`text-(--text-color) font-extrabold tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${
                            expanded ? "text-2xl" : "text-[0px]"
                            }`}>
                            White Cat
                        </span>

                        <button 
                            onClick={() => setExpanded((curr) => !curr)} 
                            className="transition-all duration-300 group p-2 rounded-lg hover:bg-(--card-bg) text-(--text-color) cursor-pointer"
                            >
                            {expanded ? (
                                <ChevronFirst />
                            ) : (
                                <>
                                    <img src={logo} alt="Logo" className="w-6 h-6 group-hover:hidden" />
                                    <ChevronLast className="hidden group-hover:block" />
                                </>
                            )}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded, closeMobileMenu: () => {} }}>
                        <ul className="flex-1 px-3 mt-2 overflow-y-auto overflow-x-hidden min-h-0">{children}</ul>
                        <ul className="px-3 m-0 list-none mb-2">{footer}</ul>
                    </SidebarContext.Provider>

                </nav>
            </aside>
        </>
    )
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded, closeMobileMenu } = useContext(SidebarContext)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (isMobile) {
        return (
            <li
                onClick={(e) => {
                    if (onClick) onClick(e);      
                    closeMobileMenu();   
                }}
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className={`
                    flex items-center gap-3 py-3 px-4 rounded-lg
                    cursor-pointer transition-all duration-100 select-none
                    ${active
                        ? "text-(--primary-color) bg-(--primary-color)/10 backdrop-blur-lg[.25]"
                        : "text-(--text-secondary) hover:text-(--text-color) hover:bg-(--primary-color)/10 hover:backdrop-blur-lg[.25]"
                    }
                `}
            >
                <div className="relative">
                    {icon}
                    {alert && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-(--primary-color)" />
                    )}
                </div>
                <span className="font-medium">{text}</span>
            </li>
        )
    }

    // Desktop
    return (
        <li
            onClick={onClick}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className={`
                relative flex items-center gap-0 py-2.5 px-2 rounded-lg
                cursor-pointer transition-all duration-100 group select-none
                ${active
                    ? "text-(--primary-color) bg-(--primary-color)/10 backdrop-blur-lg[.25]"
                    : "text-(--text-secondary) hover:text-(--text-color) hover:bg-(--primary-color)/10 hover:backdrop-blur-lg[.25]"
                }
            `}
        >
            {icon}
            <span className={`overflow-hidden transition-all whitespace-nowrap ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-(--primary-color) ${expanded ? "" : "top-2"}`}>

                </div>
            )}

            {!expanded && (
            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-(--bg-color)/60 backdrop-blur-xl 
                text-(--text-color) text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
                {text}
            </div>
            )}
        </li>
    )
}