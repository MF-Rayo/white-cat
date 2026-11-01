import React from "react";
import { useAlert } from "@/context/AlertContext";

class ErrorBoundaryClass extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
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
    >
      {children}
    </ErrorBoundaryClass>
  );
}