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

import { BRAND } from "@/config/brand"

export const SITE_NAME = BRAND.name

export const DEFAULT_DESCRIPTION =
  "Rent modern and classic Filipiniana, Barong Tagalog, boleros, pearls and kids' formal wear from Sselair — reserved by the date, fitted before you wear it, cleaning included. Philippines."

export function buildTitle(pageLabel: string): string {
  const t = pageLabel.trim()
  if (!t || t === SITE_NAME) {
    return SITE_NAME
  }
  return `${t} | ${SITE_NAME}`
}
