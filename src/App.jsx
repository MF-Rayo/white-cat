import { ChartLine, MapPin, Newspaper, Users, Settings, BookOpenText } from "lucide-react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import Sidebar, { SidebarItem } from "@/components/Sidebar"
import IocPage from "@/pages/IocMap"
import NewsPage from "@/pages/News"
import DashboardPage from "@/pages/Dashboard"
import ActiveGroupsPage from "@/pages/ActiveGroups"
import Fetch from "@/pages/Disclaimer"
import Color from "@/pages/Settings"
import { useState, useEffect } from "react"

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen w-full">
      <Sidebar footer={
        <>
          <hr className="my-3 border-white/5" />
          <SidebarItem 
            icon={<BookOpenText size={20} />} 
            text="Disclaimer"
            active={location.pathname === "/disclaimer"} 
            onClick={() => navigate("/disclaimer")} 
            alert 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            text="Settings"
            active={location.pathname === "/settings"} 
            onClick={() => navigate("/settings")} 
            alert 
          />
          <SidebarItem className="mt-auto"
              icon={
                  <img 
                  src="https://avatars.githubusercontent.com/u/236719867?s=400&u=acbc71c795adef40ff4d7b4cd29cc26da19ba58d&v=4" 
                  alt="GitHub" 
                  width={20} 
                  height={20} 
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
              }
              text="GitHub"
              onClick={() => window.open("https://github.com/MF-Rayo")} 
          /> 
        </>
      }> 
        <SidebarItem 
          icon={<ChartLine size={20} />} 
          text="Dashboard"
          active={location.pathname === "/dashboard"} 
          onClick={() => navigate("/dashboard")} 
        />

        <SidebarItem 
          icon={<MapPin size={20} />} 
          text="Threat map"
          active={location.pathname === "/ioc"} 
          onClick={() => navigate("/ioc")} 
        />

        <SidebarItem 
          icon={<Users size={20} />} 
          text="Active Groups"
          active={location.pathname === "/activegroups"} 
          onClick={() => navigate("/activegroups")} 
        />

        <SidebarItem 
          icon={<Newspaper size={20} />} 
          text="Reported News"
          active={location.pathname === "/news"} 
          onClick={() => navigate("/news")} 
        />
      </Sidebar>

      <div className={`flex-1 h-screen p-2 lg:p-2 ${isMobile ? 'pt-16' : 'pl-16'} flex items-center justify-center overflow-y-auto`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/news" element={<NewsPage/>} />
          <Route path="/activegroups" element={<ActiveGroupsPage/>} />
          <Route path="/ioc" element={<IocPage/>} />
          <Route path="/settings" element={<Color/>} />
          <Route path="/disclaimer" element={<Fetch/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App