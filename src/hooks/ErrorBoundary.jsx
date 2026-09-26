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

    if (error?.status === 429) {
      this.props.onRateLimited?.(error);
      return;
    }

    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export function ErrorBoundary({ children, resetKey, onRetry, fallback }) {
  const { showError, showWarning } = useAlert();
  const { logout } = useAuth();

  return (
    <ErrorBoundaryClass
      key={resetKey}
      fallback={fallback}
      onRetry={onRetry}
      onError={(error) => {
        showError(error?.detail || error?.message);
      }}
      onRateLimited={(error) => {
        showWarning(error?.detail);
      }}
      onSessionExpired={() => {
        showWarning("Your session expired, log in again");
        logout();
      }}
    >
      {children}
    </ErrorBoundaryClass>
  );
}