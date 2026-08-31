import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { useOrders } from "@/features/orders/queries"
import {
  formatDate,
  ORDER_STATUS_META,
  ORDER_STATUS_ORDER,
} from "@/features/orders/status"
import type { OrderStatus } from "@/features/orders/types"
import { formatPhpFromCents } from "@/lib/money"
import { EmptyState } from "@/components/ui/empty-state"
import { fileUrl } from "@/lib/api-base"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | OrderStatus

export function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders()
  const [filter, setFilter] = useState<StatusFilter>("all")

  /*
   * Only offer a status the buyer actually has. Six fixed tabs on an account
   * with two orders is four dead ends, and a tab that leads to "nothing here"
   * is worse than no tab at all. Counts come along because "Shipped 2" answers
   * the question without the click.
   */
  const tabs = useMemo(() => {
    if (!orders) return []
    const counts = new Map<OrderStatus, number>()
    for (const order of orders) {
      counts.set(order.status, (counts.get(order.status) ?? 0) + 1)
    }
    return [
      { id: "all" as StatusFilter, label: "All", count: orders.length },
      ...ORDER_STATUS_ORDER.filter((status) => counts.has(status)).map(
        (status) => ({
          id: status as StatusFilter,
          label: ORDER_STATUS_META[status].label,
          count: counts.get(status) ?? 0,
        })
      ),
    ]
  }, [orders])

  const visible = useMemo(() => {
    if (!orders) return []
    return filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter)
  }, [orders, filter])

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <DotPulse />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-base text-red-700">
        We couldn’t load your orders. Please try again.
      </p>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        art="parcel"
        title="No orders yet"
        description="When you reserve a piece it will appear here so you can track the dates and the return."
        action={
          <Button variant="pill" asChild className="h-12 px-8 text-base">
            <Link to="/shop">Browse pieces</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-ink">Order history</h2>

      {/*
        Toggle buttons rather than a real tablist: they filter a list in place
        rather than swapping panels, and `aria-pressed` says exactly that
        without owing a screen reader the arrow-key navigation tabs imply.
      */}
      {tabs.length > 2 ? (
        <div
          role="group"
          aria-label="Filter orders by status"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const active = filter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "cursor-pointer rounded-full border border-ink px-4 py-1.5 text-base transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  active
                    ? "bg-ink text-white"
                    : "bg-transparent text-ink hover:bg-ink/5"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "ml-1.5 tabular-nums",
                    active ? "text-white/70" : "text-ink-soft"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      <ul className="space-y-4">
        {visible.map((order) => {
          const itemCount = order.items.reduce((n, i) => n + i.quantity, 0)
          const preview = order.items.slice(0, 4)
          return (
            <li
              key={order.id}
              className="rounded-sm bg-white p-4 transition hover:border-ink/30 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-medium text-ink">
                    {order.order_number}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span className="text-base text-ink-soft">
                  {formatDate(order.placed_at)}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {preview.map((item) => (
                    <div
                      key={item.id}
                      className="size-12 overflow-hidden rounded-lg border border-white bg-pink-light ring-1 ring-black/5"
                    >
                      {item.image_url ? (
                        <AppImage
                          src={fileUrl(item.image_url)}
                          alt={item.product_name}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="text-base text-ink-soft">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <div>
                  <p className="text-base text-ink-soft">Total</p>
                  <p className="text-base font-semibold text-ink tabular-nums">
                    {formatPhpFromCents(order.total_cents)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="h-10! rounded-full px-6! text-sm"
                >
                  <Link to={`/account/orders/${order.id}`}>View order</Link>
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
