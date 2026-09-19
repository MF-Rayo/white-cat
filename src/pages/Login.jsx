// Base del login https://seraui.com/docs/login
//Este se modifico

import React, { useState } from 'react';
import logo from "@/assets/light.png"
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { UserRound, Key, Eye, EyeOff, Loader2 } from "lucide-react"


const Login3 = () => {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);
    try{
      const res = await login(username, password);
      if (!res.ok) {
        showAlert({ type: "info", message: res.error });
      }
    } finally{
      setLoading(false);
    }
  }

  return <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-(--card-color) dark:bg-(--bg-color)/80 backdrop-blur-xl rounded-[var(--radius-card,14px)] shadow-xl border-t-0 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
          
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                <img src={logo} className="w-20 h-20" alt="Logo" />
              </div>
              <h1 className="text-2xl font-bold text-(--text-color)">Welcome</h1>
              <p className="mt-1 text-sm text-(--text-secondary)">
                Restricted access · Features in development and testing
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-(--text-color) dark:text-(--text-color)">
                User Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserRound />
                </div>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} 
                placeholder="Enter yout username" 
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl
                 bg-gray-50 dark:bg-gray-900 text-(--text-color) dark:text-(--text-color) placeholder-gray-500 
                 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"  required/>
              </div>
            </div>

            {}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium 
              text-(--text-color) dark:text-(--text-color)">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key />
                </div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                 placeholder="Enter your password" className="block w-full pl-10 pr-12 py-3 border border-gray-300 
                 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-(--text-color) dark:text-(--text-color)
                 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200" required />
                <button type="button" onClick={togglePasswordVisibility} className=" cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff />: <Eye />}
                </button>
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                        dark:from-(--primary-color) dark:to-(--primary-color) text-white font-semibold py-3 px-4 
                        rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-(--primary-color) 
                        dark:hover:to-(--primary-color) focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-blue-500 dark:focus:ring-blue-400 transform transition-all duration-200 
                        hover:scale-[1.02] shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
    </div>;
};
export default Login3;