"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: only renders if the ROOT layout itself throws.
 * It replaces the entire document, so it must render its own <html>/<body>
 * and cannot rely on globals.css, fonts, or providers — inline styles only.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#666", fontSize: "0.875rem", lineHeight: 1.6 }}>
            The site hit an unexpected error{error.digest ? ` (reference: ${error.digest})` : ""}.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
