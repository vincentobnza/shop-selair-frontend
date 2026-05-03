import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

import type { ApiProductRow } from "./types"

type Paginated<T> = {
  data: T[]
}

export async function fetchPublicProducts(perPage = 100): Promise<ApiProductRow[]> {
  const res = await api.get<Paginated<ApiProductRow>>(apiPath("products/public"), {
    params: { per_page: perPage },
  })
  return res.data.data
}

export async function fetchPublicProduct(id: number): Promise<ApiProductRow> {
  const res = await api.get<ApiProductRow>(apiPath(`products/public/${id}`))
  return res.data
}
