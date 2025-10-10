import React, { ErrorInfo, ReactNode } from 'react';
import ErrorDisplay from './ErrorDisplay.tsx';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  // FIX: Corrected the return type from `State` to `Partial<State>` to match React's type definitions for this lifecycle method.
  static getDerivedStateFromError(error: Error): Partial<State> {
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

    // FIX: Ensure null is returned if children are not provided, as returning undefined from render causes a runtime error.
    return this.props.children || null;
  }
}

export default ErrorBoundary;