import { useEffect, useMemo, useState } from "react"

import { useAuthStore } from "@/features/auth/store"
import {
  FAVORITES_LOCAL_KEY,
  LOCAL_FAVORITES_CHANGED,
  readLocalFavoriteIds,
} from "@/features/favorites/local-favorites"
import { useFavoriteStore } from "@/features/favorites/favoritesStore"

export function useFavoriteCount(): number {
  const token = useAuthStore((s) => s.token)
  const remoteCount = useFavoriteStore((s) => s.ids.length)
  const [guestEpoch, setGuestEpoch] = useState(0)

  const guestCount = useMemo(() => {
    void guestEpoch
    return readLocalFavoriteIds().length
  }, [guestEpoch])

  useEffect(() => {
    if (token) {
      return
    }
    const bump = () => {
      queueMicrotask(() => {
        setGuestEpoch((n) => n + 1)
      })
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_LOCAL_KEY || e.key === null) {
        bump()
      }
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(LOCAL_FAVORITES_CHANGED, bump)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(LOCAL_FAVORITES_CHANGED, bump)
    }
  }, [token])

  return token ? remoteCount : guestCount
}
