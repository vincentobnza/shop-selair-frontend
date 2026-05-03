import type { FavoriteRow } from "@/features/favorites/types"
import { api } from "@/lib/axios"

type PaginatedFavorites = {
  data: FavoriteRow[]
  total: number
}

export async function fetchFavorites(perPage = 100): Promise<FavoriteRow[]> {
  const res = await api.get<PaginatedFavorites>("/api/v1/favorites", {
    params: { per_page: perPage },
  })
  return res.data.data
}

export async function addFavorite(productId: number): Promise<void> {
  await api.post("/api/v1/favorites", { product_id: productId })
}

export async function removeFavorite(productId: number): Promise<void> {
  await api.delete(`/api/v1/favorites/${productId}`)
}
