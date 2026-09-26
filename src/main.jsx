import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SidebarStateProvider } from "@/context/SidebarState"
import './styles/index.css'
import { AlertProvider } from "@/context/AlertContext"
import { AuthProvider } from "@/context/AuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AlertProvider>
    <AuthProvider>
      <SidebarStateProvider>
        <App />
      </SidebarStateProvider>
    </AuthProvider>  
  </AlertProvider>
)