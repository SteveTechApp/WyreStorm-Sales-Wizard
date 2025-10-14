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

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay message={this.state.error?.message || 'Something went wrong.'} onRetry={() => window.location.reload()} />;
    }

    // In a class component, props must be accessed via `this.props`.
    // FIX: In a class component, props must be accessed via `this.props`.
    return this.props.children;
  }
}

export default ErrorBoundary;
