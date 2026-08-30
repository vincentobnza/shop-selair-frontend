import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowClockwiseIcon, ArrowLeftIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toUserMessage } from "@/features/auth/errors"
import { useAuth } from "@/features/auth/hooks"
import { fetchOrders } from "@/features/orders/api"
import type { Order } from "@/features/orders/types"
import { fetchPayment, type PaymentView } from "@/features/payments/api"
import { formatPhpFromCents } from "@/lib/money"
import { cn } from "@/lib/utils"

/**
 * A harness for the QR Ph payment step.
 *
 * Exercising the sheet through the real checkout means rebuilding a cart for
 * every attempt, and a QR code is only payable for half an hour — so iterating
 * on this screen through the front door is slow enough that it does not get
 * done. This opens the sheet against any order that already exists.
 *
 * Development only. `AppRoutes` does not register it in a production build, so
 * the page cannot be reached on a deployed storefront even by guessing the URL.
 */
export function QrPaymentTestPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualId, setManualId] = useState("")
  const [inspected, setInspected] = useState<PaymentView | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      setOrders(await fetchOrders(25))
    } catch (err) {
      setError(toUserMessage(err))
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const inspect = async (orderId: string) => {
    setError(null)
    try {
      setInspected(await fetchPayment(orderId))
    } catch (err) {
      setInspected(null)
      setError(toUserMessage(err))
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-medium text-ink">Sign in first</h1>
        <p className="mt-2 text-base text-ink-soft">
          The payment routes are authenticated, so this harness needs a session.
        </p>
        <Button className="mt-6 rounded-full" asChild>
          <Link to="/login" state={{ backTo: "/qr-test" }}>
            Sign in
          </Link>
        </Button>
      </main>
    )
  }

  const online = orders.filter((o) => o.payment_method === "online")

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-base font-medium text-brand"
      >
        <ArrowLeftIcon size={16} weight="bold" /> Storefront
      </Link>

      <header className="mt-4">
        <h1 className="font-heading text-3xl font-medium text-ink">
          QR Ph payment harness
        </h1>
        <p className="mt-2 text-base text-ink-soft">
          Opens the payment sheet against an existing order, so the screen can be
          worked on without rebuilding a cart each time. Development build only.
        </p>
      </header>

      <section className="mt-8 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">Open by order ID</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            value={manualId}
            onChange={(e) => setManualId(e.target.value.trim())}
            placeholder="00000000-0000-0000-0000-000000000000"
            className="font-mono text-sm"
          />
          <Button
            type="button"
            variant="pill"
            disabled={manualId.length < 36}
            onClick={() => navigate(`/checkout/payment/${manualId}`)}
            className="shrink-0"
          >
            Open QR
          </Button>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">
            Your online orders{online.length > 0 ? ` (${online.length})` : ""}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            disabled={loading}
            className="rounded-full"
          >
            <ArrowClockwiseIcon size={16} aria-hidden />
            {loading ? "Loading…" : "Refresh"}
          </Button>
        </div>

        {error ? (
          <p className="mt-3 rounded-xl bg-status-danger-bg px-4 py-3 text-base text-status-danger">
            {error}
          </p>
        ) : null}

        {!loading && online.length === 0 ? (
          <p className="mt-3 rounded-xl bg-white px-4 py-6 text-center text-base text-ink-soft">
            No online orders yet. Place one from checkout with “Online payment”
            selected, then come back here to reopen its QR.
          </p>
        ) : null}

        <ul className="mt-3 space-y-2">
          {online.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{order.order_number}</p>
                <p className="text-sm text-ink-soft">
                  {formatPhpFromCents(order.total_cents)} ·{" "}
                  <span
                    className={cn(
                      "font-medium",
                      order.payment_status === "paid"
                        ? "text-status-success"
                        : "text-ink-soft"
                    )}
                  >
                    {order.payment_status}
                  </span>{" "}
                  · {order.status}
                </p>
                <p className="font-mono text-xs break-all text-ink-soft">{order.id}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void inspect(order.id)}
                  className="rounded-full"
                >
                  Inspect
                </Button>
                <Button type="button" variant="pill" size="sm" asChild>
                  <Link to={`/checkout/payment/${order.id}`}>Open QR</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {inspected ? (
        <section className="mt-6 rounded-2xl bg-white p-5">
          <h2 className="text-lg font-semibold text-ink">Payment state</h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-pink-light p-4 text-xs text-ink">
            {JSON.stringify(inspected, null, 2)}
          </pre>
        </section>
      ) : null}

    </main>
  )
}
