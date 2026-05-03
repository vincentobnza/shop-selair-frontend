import { useCallback, useEffect, useState } from "react"

import { useAuthStore } from "@/features/auth/store"
import { useFavoriteStore } from "@/features/favorites/favoritesStore"

const LOCAL_KEY = "selair-favorites"

function readLocalIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const ids = JSON.parse(raw) as string[]
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export function useFavorite(productId: string) {
  const token = useAuthStore((s) => s.token)
  const remoteIds = useFavoriteStore((s) => s.ids)
  const toggleRemote = useFavoriteStore((s) => s.toggle)

  const [localIds, setLocalIds] = useState<string[]>(() =>
    token ? [] : readLocalIds(),
  )

  useEffect(() => {
    if (!token) {
      setLocalIds(readLocalIds())
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
      const cur = prev.length ? prev : readLocalIds()
      const next = cur.includes(productId)
        ? cur.filter((id) => id !== productId)
        : [...cur, productId]
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [token, productId, toggleRemote])

  return { saved, toggle }
}
