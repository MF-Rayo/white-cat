import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AlertProvider } from "./context/AlertContext"
import './index.css'
import { applyTheme } from "./lib/themes.js";

import { AuthProvider } from "@/context/AuthContext";

const savedTheme = localStorage.getItem("app-theme") || "blue";
applyTheme(savedTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </AuthProvider>
)

{/*
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>,
)
  */}