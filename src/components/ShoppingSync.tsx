import { useEffect } from "react"
import { useAuthStore } from "@/features/auth/store"
import { useCartStore } from "@/features/cart/cartStore"
import { useFavoriteStore } from "@/features/favorites/favoritesStore"
export function ShoppingSync() {
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) {
      useCartStore.getState().resetApi()
      useFavoriteStore.getState().reset()
      return
    }
    void useCartStore.getState().load()
    void useFavoriteStore.getState().load()
  }, [token])

  return null
}
