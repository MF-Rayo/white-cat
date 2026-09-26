import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Callout } from "metricui";

const AlertContext = createContext(undefined);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const timeoutRef = useRef(null);

  const clearAlert = useCallback(() => {
    setAlert(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showAlert = useCallback((variant, title, message, duration = 5000) => {
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setAlert({ variant, title, message });

    if (duration) {
      timeoutRef.current = setTimeout(() => {
        setAlert(null);
        timeoutRef.current = null;
      }, duration);
    }
  }, []);

  const showError = useCallback((message, title = "Error", duration) => showAlert("error", title, message, duration), [showAlert]);
  const showWarning = useCallback((message, title = "Warning", duration) => showAlert("warning", title, message, duration), [showAlert]);
  const showSuccess = useCallback((message, title = "Success", duration) => showAlert("success", title, message, duration), [showAlert]);
  const showInfo = useCallback((message, title = "Info", duration) => showAlert("info", title, message, duration), [showAlert]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, showError, showWarning, showSuccess, showInfo, clearAlert }}>
      {children}
      {alert && (
        <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
          <Callout variant={alert.variant} title={alert.title} onClose={clearAlert}>
            {alert.message}
          </Callout>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}