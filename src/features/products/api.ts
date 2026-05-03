import { api } from "@/lib/axios"

import type { ApiProductRow } from "./types"

type Paginated<T> = {
  data: T[]
}

export async function fetchPublicProducts(perPage = 100): Promise<ApiProductRow[]> {
  const res = await api.get<Paginated<ApiProductRow>>("/api/v1/products/public", {
    params: { per_page: perPage },
  })
  return res.data.data
}

export async function fetchPublicProduct(id: number): Promise<ApiProductRow> {
  const res = await api.get<ApiProductRow>(`/api/v1/products/public/${id}`)
  return res.data
}
