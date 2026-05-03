import { create } from "zustand"

import * as favoritesApi from "@/features/favorites/api"
import { useAuthStore } from "@/features/auth/store"

type State = {
  ids: string[]
  loading: boolean
  load: () => Promise<void>
  toggle: (productId: string) => Promise<void>
  reset: () => void
}

export const useFavoriteStore = create<State>((set, get) => ({
  ids: [],
  loading: false,

  load: async () => {
    const token = useAuthStore.getState().token
    if (!token) {
      set({ ids: [] })
      return
    }
    set({ loading: true })
    try {
      const rows = await favoritesApi.fetchFavorites()
      const ids = rows.map((r) => String(r.product_id))
      set({ ids })
    } finally {
      set({ loading: false })
    }
  },

  toggle: async (productId: string) => {
    const token = useAuthStore.getState().token
    if (!token) return

    const idNum = Number(productId)
    const has = get().ids.includes(productId)
    if (has) {
      await favoritesApi.removeFavorite(idNum)
    } else {
      await favoritesApi.addFavorite(idNum)
    }
    await get().load()
  },

  reset: () => set({ ids: [] }),
}))
