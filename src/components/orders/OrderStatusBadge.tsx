import { ORDER_STATUS_META } from "@/features/orders/status"
import type { OrderStatus } from "@/features/orders/types"
import { cn } from "@/lib/utils"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  )
}
