import React, { ErrorInfo, ReactNode } from 'react';
import ErrorDisplay from './ErrorDisplay.tsx';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// FIX: The ErrorBoundary class must extend React.Component to be a valid React component and have access to `this.props`.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorDisplay message={this.state.error?.message || 'Something went wrong.'} onRetry={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;