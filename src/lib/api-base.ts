/** Base URL for the Laravel API (no trailing slash). Empty string = same origin (use Vite proxy in dev: `/api` → backend). */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (raw === undefined || raw === "") {
    return ""
  }
  return String(raw).replace(/\/$/, "")
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl()
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}
