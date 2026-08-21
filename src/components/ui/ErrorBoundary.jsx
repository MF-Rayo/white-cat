import React from "react";
import { useAlert } from "../../context/AlertContext";

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.retryTimeout = null;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    const isRateLimit = error?.status === 429;
   
    const retrySeconds = isRateLimit
      ? Number(error.retryAfter) || 6
      : 3;

    const message = isRateLimit
      ? `Too many requests. Retrying in ${retrySeconds}s...`
      : `Failed to load: ${error?.message || "retrying..."}`;

    this.props.onError?.({
      type: isRateLimit ? "warning" : "error",
      message,
    });

    // automatic retry
    this.retryTimeout = setTimeout(() => {
      this.props.onRetry?.();
      this.setState({ hasError: false });
    }, retrySeconds * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.retryTimeout);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export function ErrorBoundary({ children, resetKey, onRetry }) {
  const { showAlert } = useAlert();
  return (
    <ErrorBoundaryClass
      key={resetKey}
      onError={showAlert}
      onRetry={onRetry}
    >
      {children}
    </ErrorBoundaryClass>
  );
}