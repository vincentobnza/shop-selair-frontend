import { useCallback, useEffect, useState } from "react"

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
    token ? [] : readLocalFavoriteIds(),
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
    if (token) {
      await toggleRemote(productId)
      return
    }

    setLocalIds((prev) => {
      const cur = prev.length ? prev : readLocalFavoriteIds()
      const next = cur.includes(productId)
        ? cur.filter((id) => id !== productId)
        : [...cur, productId]
      try {
        localStorage.setItem(FAVORITES_LOCAL_KEY, JSON.stringify(next))
        dispatchLocalFavoritesChanged()
      } catch {
        /* ignore */
      }
      return next
    })
  }, [token, productId, toggleRemote])

  return { saved, toggle }
}
