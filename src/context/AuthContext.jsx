import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { endpoints } from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = useCallback(async () => {
        try {
        const res = await fetch(endpoints.authMe, { credentials: "include" });
        setUser(res.ok ? await res.json() : null);
        } catch {
        setUser(null);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = useCallback(async (username, password) => {
        const body = new URLSearchParams();
        body.append("username", username);
        body.append("password", password);

        const res = await fetch(endpoints.authLogin, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "include",
        body,
        });

        if (!res.ok) {
            let detail;
            try {
                const errBody = await res.json();
                detail = errBody.detail || errBody.message;
            } catch {
                detail = null;
            }
            return { ok: false, error: detail || "Error al iniciar sesión" };
        }

        const data = await res.json();
        setUser(data.user ?? { username });
        return { ok: true };
    }, []);

    const logout = useCallback(async () => {
        await fetch(endpoints.authLogout, { method: "POST", credentials: "include" });
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}