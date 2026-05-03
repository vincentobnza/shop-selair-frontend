import { useQuery } from "@tanstack/react-query"

import * as productsApi from "./api"
import { toCatalogProduct } from "./map"
import type { CatalogProduct } from "./types"

export const catalogKeys = {
  all: ["catalog"] as const,
  list: () => [...catalogKeys.all, "list"] as const,
  detail: (id: string) => [...catalogKeys.all, "detail", id] as const,
}

export function useCatalogProducts() {
  return useQuery({
    queryKey: catalogKeys.list(),
    queryFn: async (): Promise<CatalogProduct[]> => {
      const rows = await productsApi.fetchPublicProducts()
      return rows.map(toCatalogProduct)
    },
  })
}

export function useCatalogProduct(id: string | undefined) {
  const pid = id && !Number.isNaN(Number(id)) ? id : undefined
  return useQuery({
    queryKey: catalogKeys.detail(pid ?? ""),
    queryFn: async (): Promise<CatalogProduct> => {
      const row = await productsApi.fetchPublicProduct(Number(pid))
      return toCatalogProduct(row)
    },
    enabled: Boolean(pid),
  })
}
