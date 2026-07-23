import type { OrderStatus, PaymentStatus } from "./types"

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  shipped: { label: "Shipped", className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20" },
  completed: { label: "Completed", className: "bg-zinc-100 text-zinc-700 ring-zinc-600/20" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 ring-red-600/20" },
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
}

export function paymentMethodLabel(method: "cod" | "online"): string {
  return method === "cod" ? "Cash on Delivery" : "Online payment"
}

/** Statuses a buyer can still cancel. */
export function isCancellable(status: OrderStatus): boolean {
  return status === "pending" || status === "paid" || status === "processing"
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })
}
