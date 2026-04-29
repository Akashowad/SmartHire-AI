import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // In production, send to analytics: Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
          <div className="glass-panel text-center" style={{ padding: '3rem', maxWidth: '500px' }}>
            <span style={{ fontSize: '4rem' }}>🛠️</span>
            <h2 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>Something went wrong</h2>
            <p className="text-secondary mt-2">
              We encountered an unexpected error. Our team has been notified.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre
                className="mt-3"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--danger)',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                {this.state.error.stack}
              </pre>
            )}
            <button className="btn btn-primary mt-4" onClick={this.handleReset}>
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

