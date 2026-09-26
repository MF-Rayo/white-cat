import React, { useState } from 'react';
import { Callout } from "metricui";
import logo from "@/assets/light.png"

import HalftoneBloom from "@/components/HalftoneBloom"
import DataPixelArc from "@/components/PixelArc"

import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext"
import { UserRound, Key, Eye, EyeOff, Loader2 } from "lucide-react"


const Login3 = () => {
  const { login } = useAuth();
  const { showError } = useAlert();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);
    setError(null);
    try{
      const res = await login(username, password);
      if (!res.ok) {
        showError(res.error);
      }
    } finally{
      setLoading(false);
    }
  }

  return(
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10">
        <DataPixelArc />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-[var(--card-color)] rounded-[var(--radius-card,14px)] border border-[var(--border-color)] p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                <img src={logo} className="w-20 h-20 object-contain" alt="Logo" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-color)] tracking-tight">
                Welcome
              </h1>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                Restricted access · Features in development and testing
              </p>
            </div>

            {/* Input Username */}
            <div className="space-y-2">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <UserRound className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Enter your username" 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border-color)] 
                            bg-[var(--bg-color)] text-[var(--text-color)] placeholder-[var(--text-secondary)]/60 
                            text-sm transition-all duration-200 
                            focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]" 
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <Key className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-[var(--border-color)] 
                            bg-[var(--bg-color)] text-[var(--text-color)] placeholder-[var(--text-secondary)]/60 
                            text-sm transition-all duration-200 
                            focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3.5 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-color)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary-color)] hover:brightness-110 active:scale-[0.99]
                        text-white font-medium py-3 px-4 rounded-xl text-sm
                        transition-all duration-200 focus:outline-none focus:ring-2 
                        focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-[var(--card-color)] 
                        shadow-lg shadow-[var(--primary-color)]/20 cursor-pointer 
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  )
};
export default Login3;