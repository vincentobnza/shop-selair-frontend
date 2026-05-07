export type ReservationByProductKey = Record<string, number>

export type ApiReservationRow = {
  productId: string
  quantity: number
  size: string
  rentalStart: string
  rentalEnd: string
  userId: number | string | null
}
