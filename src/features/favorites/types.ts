import type { ApiProduct } from "@/features/cart/types"

export type FavoriteRow = {
  id: number
  user_id: string
  product_id: number
  product?: ApiProduct
}

export type FavoritesPage = {
  data: FavoriteRow[]
  total: number
}
