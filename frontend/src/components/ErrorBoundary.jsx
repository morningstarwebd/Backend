import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'var(--bg-dark)'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="gradient-text">Something went wrong</h2>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                        The application encountered an unexpected error.
                    </p>
                    <div style={{
                        background: 'rgba(255,0,0,0.1)',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '2rem',
                        maxWidth: '600px',
                        overflow: 'auto'
                    }}>
                        <code style={{ fontFamily: 'monospace', color: '#ef4444' }}>
                            {this.state.error && this.state.error.toString()}
                        </code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
