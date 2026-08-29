import { useQuery } from "@tanstack/react-query"

import * as reservationsApi from "./api"
import type { ProductAvailability } from "./types"

export const reservationsKeys = {
  all: ["reservations"] as const,
  availability: (productId: string) =>
    [...reservationsKeys.all, "availability", productId] as const,
}

/** Blocked date ranges for a product, for the rental date picker. */
export function useProductAvailability(productId: string | undefined) {
  const pid = productId ? String(productId) : undefined
  return useQuery({
    queryKey: reservationsKeys.availability(pid ?? ""),
    queryFn: (): Promise<ProductAvailability> =>
      reservationsApi.fetchProductAvailability(pid as string),
    enabled: Boolean(pid),
    /* Availability moves whenever anyone books; do not serve it stale for long. */
    staleTime: 30 * 1000,
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
