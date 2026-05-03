/** Base URL for the Laravel API (no trailing slash). Empty string = same origin (use Vite proxy in dev: `/api` → backend). */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (raw === undefined || raw === "") {
    return ""
  }
  return String(raw).replace(/\/$/, "")
}

/**
 * Versioned API prefix (e.g. `/api/v1`). Set `VITE_API_PREFIX` in `.env`.
 */
export function getApiPrefix(): string {
  const raw = import.meta.env.VITE_API_PREFIX
  if (raw === undefined || raw === "") {
    return "/api/v1"
  }
  const s = String(raw).trim()
  const withLeading = s.startsWith("/") ? s : `/${s}`
  return withLeading.replace(/\/$/, "")
}

/** Path under the API prefix: `apiPath("cart")` → `/api/v1/cart`. */
export function apiPath(suffix: string): string {
  const prefix = getApiPrefix()
  const tail = suffix.startsWith("/") ? suffix.slice(1) : suffix
  return `${prefix}/${tail}`
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl()
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}
