import { createContext, useContext, useState, useEffect } from "react"

const SidebarStateContext = createContext()

export function SidebarStateProvider({ children }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <SidebarStateContext.Provider value={{ open, setOpen, isMobile }}>
            {children}
        </SidebarStateContext.Provider>
    )
}

export function useSidebarState() {
    const ctx = useContext(SidebarStateContext)
    return ctx
}