import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"

import Sidebar, { SidebarItem, SidebarCategory  } from "@/components/Sidebar"

import IOCPage from "@/pages/Ioc"
import CVEPage from "@/pages/ReportedCve"
import DashboardPage from "@/pages/Dashboard"
import ActiveGroupsPage from "@/pages/ActiveGroups"
import DisclaimerPage from "@/pages/Disclaimer"
import NotFound from "@/pages/NotFound"


import { ChartLine, Earth, Users, Bug,
  Brain, BookOpenText } from "lucide-react"

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
            text="Reported IOCs"
            active={location.pathname === "/reported/ioc"} 
            onClick={() => navigate("/reported/ioc")} 
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            text="Active Groups"
            active={location.pathname === "/active/groups"} 
            onClick={() => navigate("/active/groups")} 
          />
          <SidebarItem 
            icon={<Bug size={20} />} 
            text="Reported CVEs"
            active={location.pathname === "/reported/cve"} 
            onClick={() => navigate("/reported/cve")} 
          />
        </SidebarCategory>
      </Sidebar>

      <div className="h-screen w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/reported/ioc" element={<IOCPage/>} />
          <Route path="/active/groups" element={<ActiveGroupsPage/>} />
          <Route path="/reported/cve" element={<CVEPage/>} />
          <Route path="/disclaimer" element={<DisclaimerPage/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App