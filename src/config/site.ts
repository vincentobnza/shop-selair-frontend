/** Public site URL for canonical & OG URLs (no trailing slash). Set in production via `VITE_SITE_URL`. */
export function getSiteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.replace(/\/$/, "")
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`
  }
  return ""
}

export function absolutePath(path: string): string {
  const origin = getSiteOrigin()
  const p = path.startsWith("/") ? path : `/${path}`
  return `${origin}${p}`
}

export const SITE_NAME = "Selair"

export const DEFAULT_DESCRIPTION =
  "Discover curated fashion, formal rentals, and everyday essentials. Shop with confidence or rent standout pieces for life’s moments—all in one Selair experience."

export function buildTitle(pageLabel: string): string {
  const t = pageLabel.trim()
  if (!t || t === SITE_NAME) {
    return SITE_NAME
  }
  return `${t} | ${SITE_NAME}`
}
