export type ReservationByProductKey = Record<string, number>

export type ApiReservationRow = {
  productId: string
  quantity: number
  size: string
  rentalStart: string
  rentalEnd: string
  userId: number | string | null
}

/** One inclusive span of dates a product cannot be booked on. */
export type BlockedRange = {
  from: string
  to: string
}

export type ProductAvailability = {
  blocked: BlockedRange[]
  stock: number
  durationDays: number
}
