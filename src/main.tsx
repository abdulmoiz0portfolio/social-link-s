import React from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";

// Early diagnostics: log env vars availability (not values) for debugging blank screens
console.log("[Boot] VITE_SUPABASE_URL defined:", !!import.meta.env.VITE_SUPABASE_URL);
console.log("[Boot] VITE_SUPABASE_PUBLISHABLE_KEY defined:", !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log("[Boot] Base URL:", import.meta.env.BASE_URL);
console.log("[Boot] Mode:", import.meta.env.MODE);

const root = document.getElementById("root");

if (!root) {
  document.body.innerHTML = '<div style="padding:32px;font-family:monospace;color:red">Fatal: #root element not found</div>';
} else {
  try {
    createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (e) {
    console.error("[Boot] Fatal render error:", e);
    root.innerHTML = `<div style="padding:32px;font-family:monospace;color:red"><h1>Boot Error</h1><pre>${e instanceof Error ? e.stack : e}</pre></div>`;
  }
}
