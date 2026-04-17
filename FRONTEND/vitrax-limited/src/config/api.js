/**
 * Central API configuration. Set VITE_API_URL in .env (no trailing slash).
 * Example: VITE_API_URL=http://localhost:5000
 */
const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_BASE_URL = String(raw).replace(/\/$/, "");

/** Absolute URL for API paths (e.g. /cart, /auth/login, /api/product). */
export function apiUrl(path = "") {
  if (!path || path === "/") return API_BASE_URL;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

/** Resolve a server-relative upload or static path to a full URL. */
export function assetUrl(maybeRelative) {
  if (!maybeRelative) return "";
  const s = String(maybeRelative);
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) {
    return s;
  }
  if (s.startsWith("/")) return `${API_BASE_URL}${s}`;
  return `${API_BASE_URL}/static/uploads/${s}`;
}
