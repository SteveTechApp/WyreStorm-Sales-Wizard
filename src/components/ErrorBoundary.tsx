import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorDisplay from '@/components/ErrorDisplay';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fix: The ErrorBoundary class must extend React.Component to have access to props.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          message={this.state.error?.message || 'Something went wrong.'}
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;