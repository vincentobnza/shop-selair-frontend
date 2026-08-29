import type { Order, OrderStatus, PaymentStatus } from "./types"

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  },
  completed: {
    label: "Completed",
    className: "bg-zinc-100 text-zinc-700 ring-zinc-600/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },
}

/**
 * Lifecycle order, oldest state first — drives the order-history filter tabs
 * so they always read in the order an order actually moves through.
 */
export const ORDER_STATUS_ORDER: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
]

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
}

export function paymentMethodLabel(method: "cod" | "online"): string {
  return method === "cod" ? "Cash on Delivery" : "Online payment"
}

/**
 * Whether the buyer may make a given move.
 *
 * The API sends `allowed_transitions` with every order it shows the buyer, so
 * this reads the server's answer rather than keeping a second copy of the
 * lifecycle that can drift. The fallback covers an older response shape.
 */
export function buyerCan(order: Order, to: OrderStatus): boolean {
  if (order.allowed_transitions) {
    return order.allowed_transitions.includes(to)
  }
  if (to === "cancelled") {
    return (
      order.status === "pending" ||
      order.status === "paid" ||
      order.status === "processing"
    )
  }
  return to === "completed" && order.status === "shipped"
}

export { formatDate } from "@/lib/dates"
