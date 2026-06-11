import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/');
    } catch (e) {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              border: '1px solid #f3f4f6',
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px',
              }}
            >
              ⚠️
            </div>
            
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Something went wrong
            </h1>
            
            <p
              style={{
                fontSize: '14px',
                color: '#4b5563',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              The application encountered an unexpected error. This might be due to corrupted local data. You can try reloading or resetting the app.
            </p>

            {this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  backgroundColor: '#f9fafb',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#4b5563',
                  marginBottom: '24px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontWeight: 600, outline: 'none' }}>
                  Error details
                </summary>
                <pre
                  style={{
                    marginTop: '8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button onClick={this.handleReload} style={{ width: '100%', height: '44px' }}>
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReset}
                style={{
                  width: '100%',
                  height: '44px',
                  borderColor: '#f3f4f6',
                  color: '#ef4444',
                  backgroundColor: '#fdf2f2',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fde2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fdf2f2';
                }}
              >
                Clear Data & Reset App
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
