import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type { ApiReservationRow, ProductAvailability } from "./types"

/**
 * Dates a product is fully booked, across every customer.
 *
 * This is a public endpoint and deliberately anonymous — it returns date spans,
 * not who booked them. It replaced a call to `GET /reservations`, which only
 * ever returned the signed-in user's own bookings: guests saw no blocked dates
 * at all, and a customer could double-book a piece someone else already had.
 */
export async function fetchProductAvailability(
  productId: string
): Promise<ProductAvailability> {
  const res = await api.get(
    apiPath(`products/public/${productId}/availability`)
  )
  return {
    blocked: res.data.data ?? [],
    stock: res.data.meta?.stock ?? 0,
    durationDays: res.data.meta?.duration_days ?? 0,
  }
}

export async function listReservations(): Promise<ApiReservationRow[]> {
  const res = await api.get(apiPath("reservations"))
  return res.data.data
}

export async function fetchReservation(id: string): Promise<ApiReservationRow> {
  const res = await api.get(apiPath(`reservations/${id}`))
  return res.data.data
}

export async function createReservation(payload: {
  product_id: string | number
  quantity?: number
  size?: string
  rental_start: string
  rental_end: string
  notes?: string
}): Promise<ApiReservationRow> {
  const res = await api.post(apiPath("reservations"), payload)
  return res.data.data
}

export async function cancelReservation(id: string): Promise<void> {
  await api.patch(apiPath(`reservations/${id}/cancel`))
}
