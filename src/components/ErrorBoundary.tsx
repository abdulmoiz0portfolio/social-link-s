import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: "monospace", background: "#1a1a2e", color: "#e94560", minHeight: "100vh" }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>⚠️ Application Crash</h1>
          <p style={{ color: "#eee", marginBottom: 8 }}>
            <strong>Error:</strong> {this.state.error?.message}
          </p>
          <details open style={{ marginTop: 16 }}>
            <summary style={{ color: "#eee", cursor: "pointer", marginBottom: 8 }}>Stack Trace</summary>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#ccc", background: "#0f0f23", padding: 16, borderRadius: 8, overflow: "auto" }}>
              {this.state.error?.stack}
            </pre>
          </details>
          {this.state.errorInfo && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ color: "#eee", cursor: "pointer", marginBottom: 8 }}>Component Stack</summary>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#ccc", background: "#0f0f23", padding: 16, borderRadius: 8, overflow: "auto" }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 24, padding: "10px 20px", background: "#e94560", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
