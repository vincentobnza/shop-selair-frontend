import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { useAuthStore } from "@/features/auth/store"
import { useFavoriteStore } from "@/features/favorites/favoritesStore"
import {
  FAVORITES_LOCAL_KEY,
  dispatchLocalFavoritesChanged,
  readLocalFavoriteIds,
} from "@/features/favorites/local-favorites"

export function useFavorite(productId: string) {
  const token = useAuthStore((s) => s.token)
  const remoteIds = useFavoriteStore((s) => s.ids)
  const toggleRemote = useFavoriteStore((s) => s.toggle)

  const [localIds, setLocalIds] = useState<string[]>(() =>
    token ? [] : readLocalFavoriteIds()
  )

  useEffect(() => {
    if (!token) {
      setLocalIds(readLocalFavoriteIds())
    }
  }, [token, productId])

  const saved = token
    ? remoteIds.includes(productId)
    : localIds.includes(productId)

  const toggle = useCallback(async () => {
    const wasSaved = saved
    if (token) {
      await toggleRemote(productId)
      if (!wasSaved) toast.success("Saved to favorites")
      return
    }

    const cur = readLocalFavoriteIds()
    const adding = !cur.includes(productId)
    setLocalIds((prev) => {
      const base = prev.length ? prev : cur
      const next = base.includes(productId)
        ? base.filter((id) => id !== productId)
        : [...base, productId]
      try {
        localStorage.setItem(FAVORITES_LOCAL_KEY, JSON.stringify(next))
        dispatchLocalFavoritesChanged()
      } catch {
        /* ignore */
      }
      return next
    })
    if (adding) toast.success("Saved to favorites")
  }, [token, productId, toggleRemote, saved])

  return { saved, toggle }
}
