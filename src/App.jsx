import { ChartLine, FileBraces, Network, Brain, Earth, Newspaper, Users, Settings, BookOpenText, 
  UserRoundKey, Link2, FileTerminal, LogOut, ScanSearch, Library, Summary, ShieldAlert } from "lucide-react"
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import Sidebar, { SidebarItem, SidebarCategory  } from "@/components/Sidebar"
import ThreatPage from "#src/pages/ThreatMap.jsx"
import NewsPage from "@/pages/News"
import DashboardPage from "@/pages/Dashboard"
import ActiveGroupsPage from "@/pages/ActiveGroups"
import DisclaimerBlock from "@/pages/Disclaimer"
import WebSandbox from "@/pages/tools/webSanbox"
import WebCheckMail from "@/pages/tools/webCheckMail"
import Color from "@/pages/Settings"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"

function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
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


  function Logout(){
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout(){
      await logout();
      navigate("/")
    }

    if (isAuthenticated)
      return(
        <SidebarItem 
          icon={<LogOut size={20} />} 
          text="Logout"
          active={location.pathname === "/logout"} 
          onClick={handleLogout} 
          alert 
        />
      )
  }

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

          <Logout/>

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
        <SidebarCategory icon={<Brain size={20} />} text="Threat Intelligence" defaultOpen>
          <SidebarItem 
            icon={<Earth size={18} />} 
            text="Threat Map"
            active={location.pathname === "/threat/map"} 
            onClick={() => navigate("/threat/map")} 
          />
          <SidebarItem 
            icon={<Newspaper size={18} />} 
            text="Reported News"
            active={location.pathname === "/news"} 
            onClick={() => navigate("/news")} 
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            text="Active Groups"
            active={location.pathname === "/activegroups"} 
            onClick={() => navigate("/activegroups")} 
          />
        </SidebarCategory>

        <SidebarCategory icon={<ScanSearch size={20} />} text="Investigation Tools">
          <SidebarItem 
            icon={<Link2   size={18} />} 
            text="Web Sandbox"
            active={location.pathname === "/web/sanbox"} 
            onClick={() => navigate("/web/sanbox")} 
          />
          <SidebarItem 
            icon={<UserRoundKey size={18} />} 
            text="Email Leak Checker"
            active={location.pathname === "/check/mail"} 
            onClick={() => navigate("/check/mail")} 
          />
        </SidebarCategory> 
      </Sidebar>

      <div className={`flex-1 h-screen p-2 lg:p-2 ${isMobile ? 'pt-16' : 'pl-16'} flex items-center justify-center overflow-y-auto`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/news" element={<NewsPage/>} />
          <Route path="/activegroups" element={<ActiveGroupsPage/>} />
          <Route path="/threat/map" element={<ThreatPage/>} />
          <Route path="/settings" element={<Color/>} />
          <Route path="/disclaimer" element={<DisclaimerBlock/>} />
          <Route path="/web/sanbox" element={<WebSandbox/>} />
          <Route path="/check/mail" element={<WebCheckMail/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App