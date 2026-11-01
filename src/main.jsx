import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SidebarStateProvider } from "@/context/SidebarState"
import './styles/index.css'
import { AlertProvider } from "@/context/AlertContext"

ReactDOM.createRoot(document.getElementById('root')).render(
  <AlertProvider>
    <SidebarStateProvider>
      <App />
    </SidebarStateProvider> 
  </AlertProvider>
)