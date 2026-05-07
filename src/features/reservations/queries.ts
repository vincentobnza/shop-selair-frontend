import { useQuery } from "@tanstack/react-query"

import * as reservationsApi from "./api"
import type { ApiReservationRow } from "./types"

export const reservationsKeys = {
  all: ["reservations"] as const,
  byProduct: (productId: string) =>
    [...reservationsKeys.all, "by-product", productId] as const,
}

export function useReservationsByProduct(productId: string | undefined) {
  const pid = productId ? String(productId) : undefined
  return useQuery({
    queryKey: reservationsKeys.byProduct(pid ?? ""),
    queryFn: async (): Promise<ApiReservationRow[]> => {
      const rows = await reservationsApi.fetchReservationsByProduct()
      if (!pid) return []
      return rows.filter((r) => String(r.productId) === pid)
    },
    enabled: Boolean(pid),
  })
}

export function useReservation(id: string | undefined) {
  return useQuery({
    queryKey: [...reservationsKeys.all, "detail", id ?? ""],
    queryFn: async () => {
      if (!id) return null
      return reservationsApi.fetchReservation(id)
    },
    enabled: Boolean(id),
  })
}
