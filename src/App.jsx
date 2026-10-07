import { useState, useEffect } from "react"
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"

import { useAuth } from "@/context/AuthContext"
import Sidebar, { SidebarItem, SidebarCategory  } from "@/components/Sidebar"

import IOCPage from "@/pages/Ioc"
import LeakPage from "@/pages/LeakChecker"
import CVEPage from "@/pages/cveReported"
import DashboardPage from "@/pages/Dashboard"
import ActiveGroupsPage from "@/pages/ActiveGroups"
import WebAnalyzePage from "@/pages/WebAnalyzer"
import DisclaimerPage from "@/pages/Disclaimer"

import { ChartLine, Earth, Users, Newspaper, LogOut, Bug,
  Brain, BookOpenText, ScanSearch, Link2, UserRoundKey } from "lucide-react"

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
          <Logout/>
          <SidebarItem 
            icon={<BookOpenText size={20} />} 
            text="Disclaimer"
            active={location.pathname === "/disclaimer"} 
            onClick={() => navigate("/disclaimer")} 
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

        <SidebarCategory icon={<Brain size={20} />} text="Threat Intelligence" defaultOpen>
          <SidebarItem 
            icon={<Earth size={18} />} 
            text="Global IOC"
            active={location.pathname === "/ioc"} 
            onClick={() => navigate("/ioc")} 
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            text="Active Groups"
            active={location.pathname === "/active/groups"} 
            onClick={() => navigate("/active/groups")} 
          />
          <SidebarItem 
            icon={<Bug size={20} />} 
            text="CVE Reported"
            active={location.pathname === "/cve/reported"} 
            onClick={() => navigate("/cve/reported")} 
          />
        </SidebarCategory>


        <SidebarCategory icon={<ScanSearch size={20} />} text="Investigation Tools" defaultOpen>
          <SidebarItem 
            icon={<Link2   size={18} />} 
            text="Web Analyzer"
            active={location.pathname === "/web/analyzer"} 
            onClick={() => navigate("/web/analyzer")} 
          />
          <SidebarItem 
            icon={<UserRoundKey size={18} />} 
            text="Leak Checker"
            active={location.pathname === "/leak/checker"} 
            onClick={() => navigate("/leak/checker")} 
          />
        </SidebarCategory> 
    
      </Sidebar>

      <div className="h-screen w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/ioc" element={<IOCPage/>} />
          <Route path="/active/groups" element={<ActiveGroupsPage/>} />
          <Route path="/cve/reported" element={<CVEPage/>} />
          <Route path="/web/analyzer" element={<WebAnalyzePage/>} />
          <Route path="/leak/checker" element={<LeakPage/>} />
          <Route path="/disclaimer" element={<DisclaimerPage/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App