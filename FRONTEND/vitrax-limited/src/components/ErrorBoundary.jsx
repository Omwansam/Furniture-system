import React from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-6, 2rem)",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            color: "var(--color-text-primary)",
            background: "var(--color-bg-warm)",
          }}
        >
          <h1 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: "28rem", marginBottom: "1.5rem" }}>
            This section could not be displayed. You can go back home or refresh the page.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              background: "var(--color-secondary)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Back to Vitrax Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
