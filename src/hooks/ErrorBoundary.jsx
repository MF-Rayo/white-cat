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

    if (status === 502) {
      this.props.onBadGateway?.(error);
      return;
    }

    if (status === 504) {
      this.props.onTimeout?.(error);
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
        const msg = "Too many requests, please try again later";
        showWarning(msg);
      }}
      onSessionExpired={() => {
        showWarning("Your session expired, log in again");
        logout();
      }}
      onBadGateway={(error) => {
        showError(
          error?.detail ||
          "The analysis service is unavailable"
        );
      }}
      onTimeout={(error) => {
        showError(
          error?.detail ||
          "The analysis timed out"
        );
      }}
    >
      {children}
    </ErrorBoundaryClass>
  );
}