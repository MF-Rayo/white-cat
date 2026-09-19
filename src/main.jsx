import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SidebarStateProvider } from "@/context/SidebarState"
import { AlertProvider } from "./context/AlertContext"
import './styles/index.css'

import { AuthProvider } from "@/context/AuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <AlertProvider>
        <SidebarStateProvider>
          <App />
        </SidebarStateProvider>
      </AlertProvider>
    </AuthProvider>
)