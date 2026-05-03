import type { FavoriteRow } from "@/features/favorites/types"
import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

type PaginatedFavorites = {
  data: FavoriteRow[]
  total: number
}

export async function fetchFavorites(perPage = 100): Promise<FavoriteRow[]> {
  const res = await api.get<PaginatedFavorites>(apiPath("favorites"), {
    params: { per_page: perPage },
  })
  return res.data.data
}

export async function addFavorite(productId: number): Promise<void> {
  await api.post(apiPath("favorites"), { product_id: productId })
}

export async function removeFavorite(productId: number): Promise<void> {
  await api.delete(apiPath(`favorites/${productId}`))
}
