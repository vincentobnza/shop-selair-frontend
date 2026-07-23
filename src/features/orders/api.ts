import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type { CreateOrderInput, Order } from "./types"

type Paginated<T> = { data: T[]; total: number }

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await api.post<{ data: Order }>(apiPath("orders"), input)
  return res.data.data
}

export async function fetchOrders(perPage = 20): Promise<Order[]> {
  const res = await api.get<Paginated<Order>>(apiPath("orders"), {
    params: { per_page: perPage },
  })
  return res.data.data
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await api.get<{ data: Order }>(apiPath(`orders/${id}`))
  return res.data.data
}

export async function cancelOrder(id: string): Promise<Order> {
  const res = await api.patch<{ data: Order }>(apiPath(`orders/${id}/cancel`))
  return res.data.data
}
