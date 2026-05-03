export const FAVORITES_LOCAL_KEY = "selair-favorites"

export function readLocalFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_LOCAL_KEY)
    if (!raw) return []
    const ids = JSON.parse(raw) as string[]
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export function removeLocalFavoriteId(productId: string): void {
  const next = readLocalFavoriteIds().filter((id) => id !== productId)
  try {
    localStorage.setItem(FAVORITES_LOCAL_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  dispatchLocalFavoritesChanged()
}

/** Same-tab listeners (storage event only fires across tabs). */
export const LOCAL_FAVORITES_CHANGED = "selair-favorites-local"

export function dispatchLocalFavoritesChanged(): void {
  if (typeof window === "undefined") {
    return
  }
  window.dispatchEvent(new CustomEvent(LOCAL_FAVORITES_CHANGED))
}
