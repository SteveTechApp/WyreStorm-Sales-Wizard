import React, { ErrorInfo, ReactNode } from 'react';
import ErrorDisplay from './ErrorDisplay.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Using a constructor to initialize state. This is a more robust pattern
  // that avoids potential TypeScript issues with `this.props` not being correctly identified
  // when using class property initialization for state.
  
  // GPE_FIX: Replaced the constructor with class property state initialization. This is the modern standard for React class components and resolves the type errors regarding 'state' and 'props'.
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: any): Partial<State> | null {
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