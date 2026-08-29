import { PackageIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { useOrders } from "@/features/orders/queries"
import { formatDate } from "@/features/orders/status"
import { formatPhpFromCents } from "@/lib/money"
export function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders()

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
      <div className="flex flex-col items-center rounded-sm bg-pink-light px-6 py-16 text-center">
        <PackageIcon size={48} className="text-line" />{" "}
        <h2 className="mt-4 text-lg font-medium text-ink">No orders yet</h2>{" "}
        <p className="mt-1 max-w-sm text-base text-ink-soft">
          When you place an order it will appear here so you can track it.
        </p>
        <Button variant="outline" asChild className="mt-6 rounded-full px-8">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-ink">Order history</h2>{" "}
      <ul className="space-y-4">
        {orders.map((order) => {
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
                          src={item.image_url}
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
                  <p className="text-base text-ink-soft">Total</p>{" "}
                  <p className="text-base font-semibold text-ink tabular-nums">
                    {formatPhpFromCents(order.total_cents)}
                  </p>
                </div>
                <Button variant="outline" asChild className="rounded-full">
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
