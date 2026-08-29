import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { toUserMessage } from "@/features/auth/errors"
import { useCancelOrder, useOrder } from "@/features/orders/queries"
import {
  formatDate,
  isCancellable,
  paymentMethodLabel,
  PAYMENT_STATUS_LABEL,
} from "@/features/orders/status"
import { formatPhpFromCents } from "@/lib/money"
import { fileUrl } from "@/lib/api-base"
export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const justPlaced = params.get("placed") === "1"

  const { data: order, isLoading, isError } = useOrder(id)
  const cancel = useCancelOrder()

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <DotPulse />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="space-y-4">
        <p className="text-base text-red-700">We couldn’t find this order.</p>{" "}
        <Button variant="outline" asChild className="rounded-full">
          <Link to="/account/orders">Back to orders</Link>
        </Button>
      </div>
    )
  }

  const onCancel = () => {
    cancel.mutate(order.id, {
      onSuccess: () => toast.success("Order cancelled."),
      onError: (e) => toast.error(toUserMessage(e)),
    })
  }

  const addr = order.shipping_address

  return (
    <div className="space-y-6">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1.5 text-base text-ink-soft hover:text-ink"
      >
        <ArrowLeftIcon size={16} /> Back to orders
      </Link>

      {justPlaced ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircleIcon
            size={24}
            weight="fill"
            className="mt-0.5 shrink-0 text-emerald-600"
          />
          <div>
            <p className="text-base font-medium text-emerald-900">
              Thank you! Your order is confirmed.
            </p>
            <p className="mt-0.5 text-base text-emerald-700">
              We’ve received order {order.order_number}. A confirmation will
              follow shortly.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-ink">{order.order_number}</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <span className="text-base text-ink-soft">
          Placed {formatDate(order.placed_at)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        {/* Items */}
        <div className="rounded-sm bg-white">
          <ul className="divide-y divide-line px-5">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-pink-light">
                  {item.image_url ? (
                    <AppImage
                      src={fileUrl(item.image_url)}
                      alt={item.product_name}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-ink">
                    {item.product_name}
                  </p>
                  {item.size_label ? (
                    <p className="mt-0.5 text-base text-ink-soft">
                      Size {item.size_label}
                    </p>
                  ) : null}
                  {item.rental_start && item.rental_end ? (
                    <p className="mt-0.5 text-base text-ink-soft">
                      Rental {item.rental_start} → {item.rental_end}
                    </p>
                  ) : null}
                  <p className="mt-1 text-base text-ink-soft">
                    {formatPhpFromCents(item.unit_price_cents)} ×{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-base font-semibold text-ink tabular-nums">
                  {formatPhpFromCents(item.subtotal_cents)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary + shipping */}
        <div className="space-y-6">
          <div className="rounded-sm bg-white p-5">
            <h3 className="text-base font-medium text-ink">Summary</h3>{" "}
            <dl className="mt-4 space-y-2 text-base">
              <Row
                label="Subtotal"
                value={formatPhpFromCents(order.subtotal_cents)}
              />
              {order.discount_cents > 0 ? (
                <Row
                  label={`Discount${order.voucher_code ? ` (${order.voucher_code})` : ""}`}
                  value={`−${formatPhpFromCents(order.discount_cents)}`}
                  valueClassName="text-emerald-700"
                />
              ) : null}
              <Row
                label="Shipping"
                value={
                  order.shipping_cents === 0
                    ? "Free"
                    : formatPhpFromCents(order.shipping_cents)
                }
              />
              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="text-base font-medium text-ink">Total</span>{" "}
                <span className="text-lg font-semibold text-ink tabular-nums">
                  {formatPhpFromCents(order.total_cents)}
                </span>
              </div>
            </dl>
            <p className="mt-4 text-base text-ink-soft">
              {paymentMethodLabel(order.payment_method)} ·{" "}
              {PAYMENT_STATUS_LABEL[order.payment_status]}
            </p>
          </div>
          <div className="rounded-sm bg-white p-5">
            <h3 className="text-base font-medium text-ink">Delivery</h3>{" "}
            <address className="mt-3 text-base text-ink-soft not-italic">
              <span className="font-medium text-ink">
                {addr.recipient_name}
              </span>
              <br />
              {addr.phone}
              <br />
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ""}
              <br />
              {addr.city}, {addr.region} {addr.postal_code}
            </address>
            {order.notes ? (
              <p className="mt-3 border-t border-line pt-3 text-base text-ink-soft">
                Notes: {order.notes}
              </p>
            ) : null}
          </div>
          {isCancellable(order.status) ? (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={cancel.isPending}
              className="w-full rounded-full text-red-700 hover:bg-red-50"
            >
              {cancel.isPending ? "Cancelling…" : "Cancel order"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-soft">{label}</dt>{" "}
      <dd className={`tabular-nums ${valueClassName ?? "text-ink"}`}>
        {value}
      </dd>
    </div>
  )
}
