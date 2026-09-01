import React from "react";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";

class ErrorBoundaryClass extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (error?.status === 401) {
      this.props.onSessionExpired?.();
      return;
    }

    this.props.onError?.({
      type: "danger",
      message: error?.message,
    });
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function ErrorBoundary({ children, resetKey, onRetry }) {
  const { showAlert } = useAlert();
  const { logout } = useAuth();

  return (
    <ErrorBoundaryClass
      key={resetKey}
      onError={showAlert}
      onRetry={onRetry}
      onSessionExpired={() => {
        showAlert({ type: "warning", message: "Your session expired, log in again" });
        logout();
      }}
    >
      {children}
    </ErrorBoundaryClass>
  );
}