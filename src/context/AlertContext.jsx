import { createContext, useContext, useState, useCallback } from "react"
import { Alert } from "../components/ui/Alert"

const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  const showAlert = useCallback(({ type = "info", message }) => {
    const id = crypto.randomUUID()
    setAlerts(prev => [...prev, { id, type, message }])
  }, [])

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Portal de alertas — esquina inferior derecha */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            id={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={removeAlert}
          />
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error("useAlert debe usarse dentro de <AlertProvider>")
  return ctx
}