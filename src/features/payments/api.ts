import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

/** Mirrors `PaymentAttemptStatus` on the API. */
export type PaymentStatus =
  | "awaiting_payment_method"
  | "awaiting_next_action"
  | "processing"
  | "succeeded"
  | "failed"
  | "expired"
  | "cancelled"

export type PaymentView = {
  orderId: string
  orderNumber: string
  status: PaymentStatus
  amountCents: number
  currency: string
  /** Base64 data URI of the QR Ph code. Null once it can no longer be paid. */
  qrImageUrl: string | null
  expiresAt: string | null
  paidAt: string | null
  /** The order is settled, whatever this particular attempt says. */
  orderPaid: boolean
  /**
   * The API is running against a test key.
   *
   * Sent on every response, and it is what the "do not scan" warning keys off.
   * PayMongo mints a genuine, bank-payable QR Ph code even in test mode, so the
   * hazard belongs to the mode, not to any single reply.
   */
  testMode: boolean
  /**
   * Simulation link. Test mode only, and only on the reply that created the
   * attempt — it is not stored, so a poll or a reload returns null.
   */
  testUrl: string | null
}

/**
 * Start the QR Ph payment, or get back the one already running.
 *
 * Safe to call again on a reload: the API returns the live QR rather than
 * opening a second payment against the same order.
 */
export async function startQrPhPayment(orderId: string): Promise<PaymentView> {
  const res = await api.post<{ data: PaymentView }>(
    apiPath(`orders/${orderId}/payment/qrph`)
  )
  return res.data.data
}

/** Cheap poll while the customer is in their banking app. Reads our own data. */
export async function fetchPayment(orderId: string): Promise<PaymentView> {
  const res = await api.get<{ data: PaymentView }>(
    apiPath(`orders/${orderId}/payment`)
  )
  return res.data.data
}

/**
 * Ask the API to check with PayMongo directly.
 *
 * For when a webhook is late or lost — without this a customer who has already
 * paid would sit on the QR screen until the code expired. Rate limited on the
 * server, so it is used sparingly rather than every tick.
 */
export async function refreshPayment(orderId: string): Promise<PaymentView> {
  const res = await api.post<{ data: PaymentView }>(
    apiPath(`orders/${orderId}/payment/refresh`)
  )
  return res.data.data
}
