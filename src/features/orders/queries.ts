import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import * as ordersApi from "./api"
import type { CreateOrderInput, Order } from "./types"

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
}

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => ordersApi.fetchOrders(),
  })
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => ordersApi.fetchOrder(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.createOrder(input),
    onSuccess: (order: Order) => {
      qc.invalidateQueries({ queryKey: orderKeys.list() })
      qc.setQueryData(orderKeys.detail(order.id), order)
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: (order: Order) => {
      qc.invalidateQueries({ queryKey: orderKeys.list() })
      qc.setQueryData(orderKeys.detail(order.id), order)
    },
  })
}
