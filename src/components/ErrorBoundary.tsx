import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('PayAssist Error:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="route-loading" style={{ flexDirection: 'column', gap: '10px' }}>
          <div>Something went wrong</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
            PayAssist hit an error, but your payment data is safe.
          </div>
          <button className="btn-primary" onClick={() => window.location.reload()} type="button">
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
