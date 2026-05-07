import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type { ApiReservationRow } from "./types"

export async function fetchReservationsByProduct(): Promise<
  ApiReservationRow[]
> {
  const res = await api.get(apiPath("reservations"))
  return res.data.data
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
