import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { BRAND } from "@/config/brand"
import { buildTitle } from "@/config/site"
import { toUserMessage } from "@/features/auth/errors"
import { useAuth } from "@/features/auth/hooks"
import {
  fetchPayment,
  refreshPayment,
  startQrPhPayment,
  type PaymentView,
} from "@/features/payments/api"
import { cn } from "@/lib/utils"

const currencyFormatter = new Intl.NumberFormat(BRAND.locale, {
  style: "currency",
  currency: BRAND.currency,
  maximumFractionDigits: 2,
})

/** How often to ask our own API whether the webhook has landed. */
const POLL_MS = 3000
/**
 * How often to have the API ask PayMongo directly. Much rarer than the poll:
 * the webhook is the normal path and this only covers its failure.
 */
const RECONCILE_EVERY = 6
/** Statuses that mean there is nothing left to wait for. */
const SETTLED: PaymentView["status"][] = [
  "succeeded",
  "failed",
  "expired",
  "cancelled",
]

function useCountdown(expiresAt: string | null): string | null {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!expiresAt) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [expiresAt])

  if (!expiresAt) return null
  const remaining = new Date(expiresAt).getTime() - now
  if (remaining <= 0) return null

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/**
 * The QR Ph payment step, as a page of its own.
 *
 * A page rather than an overlay on checkout, for reasons that are practical
 * rather than aesthetic: payment happens in another app entirely, so the
 * customer leaves and comes back. A route can be reloaded, reopened from the
 * order page, and kept in history; a modal over a checkout whose cart has
 * already been emptied cannot survive any of that.
 *
 * Two signals are watched, because neither alone is enough. The poll reads our
 * own database and catches the webhook the instant it lands; every few ticks it
 * escalates to a reconcile that asks PayMongo directly, which is what rescues a
 * customer whose webhook was dropped between two servers.
 */
export function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [payment, setPayment] = useState<PaymentView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const tickRef = useRef(0)
  const paidRef = useRef(false)

  const countdown = useCountdown(payment?.expiresAt ?? null)
  const settled = payment ? SETTLED.includes(payment.status) : false
  const paid = Boolean(payment?.orderPaid || payment?.status === "succeeded")

  const begin = useCallback(async () => {
    if (!orderId) return
    setStarting(true)
    setError(null)
    try {
      setPayment(await startQrPhPayment(orderId))
    } catch (err) {
      setError(toUserMessage(err))
    } finally {
      setStarting(false)
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId || !isAuthenticated) return
    paidRef.current = false
    tickRef.current = 0
    void begin()
  }, [orderId, isAuthenticated, begin])

  /* Watch for the money. Stops the moment the attempt reaches a final state. */
  useEffect(() => {
    if (!orderId || !payment || paid || settled) return

    const id = window.setInterval(() => {
      tickRef.current += 1
      const ask =
        tickRef.current % RECONCILE_EVERY === 0 ? refreshPayment : fetchPayment
      void ask(orderId)
        .then((next) =>
          /* Carry the simulation link forward. Only the create call returns
             one, so taking the poll's response wholesale wiped it a few seconds
             after the page loaded. */
          setPayment((prev) => ({
            ...next,
            testUrl: next.testUrl ?? prev?.testUrl ?? null,
          }))
        )
        /* A failed poll is not worth surfacing: the next tick tries again, and
           an error every three seconds is worse than silence. */
        .catch(() => undefined)
    }, POLL_MS)

    return () => window.clearInterval(id)
  }, [orderId, payment, paid, settled])

  /* Move on exactly once, and only after the confirmation has been seen. */
  useEffect(() => {
    if (!paid || paidRef.current || !orderId) return
    paidRef.current = true
    toast.success("Payment received — your reservation is confirmed.")
    const id = window.setTimeout(
      () => navigate(`/account/orders/${orderId}?placed=1`, { replace: true }),
      2200
    )
    return () => window.clearTimeout(id)
  }, [paid, orderId, navigate])

  if (!isAuthenticated) {
    return (
      <Shell>
        <Outcome
          tone="warning"
          title="Sign in to continue"
          body="Your order is safe. Sign in and it will be waiting to be paid."
          action={
            <Button variant="pill" className="h-12 w-full" asChild>
              <Link
                to="/login"
                state={{ backTo: `/checkout/payment/${orderId ?? ""}` }}
              >
                Sign in
              </Link>
            </Button>
          }
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <Helmet>
        <title>{buildTitle("Complete your payment")}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <QrPanel
        payment={payment}
        starting={starting}
        error={error}
        countdown={countdown}
        onRetry={() => void begin()}
        orderId={orderId ?? ""}
      />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <div className="rounded-3xl bg-white px-6 py-8 text-center sm:px-8">
          {children}
        </div>
      </div>
    </main>
  )
}

type QrPanelProps = {
  payment: PaymentView | null
  starting: boolean
  error: string | null
  countdown: string | null
  onRetry: () => void
  orderId: string
}

function QrPanel({
  payment,
  starting,
  error,
  countdown,
  onRetry,
  orderId,
}: QrPanelProps) {
  const orderHref = `/account/orders/${orderId}`

  if (error) {
    return (
      <Outcome
        tone="warning"
        title="We could not start the payment"
        body={error}
        action={
          <div className="flex w-full flex-col gap-2">
            <Button variant="pill" onClick={onRetry} className="h-12 w-full">
              Try again
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-full border-ink/20"
              asChild
            >
              <Link to={orderHref}>View the order</Link>
            </Button>
          </div>
        }
      />
    )
  }

  if (starting || !payment) {
    return (
      <div className="py-20">
        <DotPulse label="Preparing your QR code" className="justify-center" />
      </div>
    )
  }

  if (payment.orderPaid || payment.status === "succeeded") {
    return (
      <Outcome
        tone="success"
        title="Payment received"
        body={`We have your ${currencyFormatter.format(payment.amountCents / 100)}. Your reservation is confirmed.`}
        action={
          <Button variant="pill" className="h-12 w-full" asChild>
            <Link to={orderHref}>View the order</Link>
          </Button>
        }
      />
    )
  }

  if (payment.status === "expired" || !payment.qrImageUrl) {
    return (
      <Outcome
        tone="warning"
        title="This code has expired"
        body="Nothing was charged. Start again to get a fresh code."
        action={
          <div className="flex w-full flex-col gap-2">
            <Button variant="pill" onClick={onRetry} className="h-12 w-full">
              Get a new code
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-full border-ink/20"
              asChild
            >
              <Link to={orderHref}>View the order</Link>
            </Button>
          </div>
        }
      />
    )
  }

  if (payment.status === "failed" || payment.status === "cancelled") {
    return (
      <Outcome
        tone="warning"
        title="The payment did not go through"
        body="Nothing was charged. You can try again, or pay another way."
        action={
          <div className="flex w-full flex-col gap-2">
            <Button variant="pill" onClick={onRetry} className="h-12 w-full">
              Try again
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-full border-ink/20"
              asChild
            >
              <Link to={orderHref}>View the order</Link>
            </Button>
          </div>
        }
      />
    )
  }

  return (
    <>
      <h1 className="font-heading text-3xl font-medium text-ink">
        Scan to pay
      </h1>
      <p className="mt-2 text-base text-ink-soft">
        Open GCash, Maya or any bank app and scan this QR Ph code.
      </p>

      {/*
        Test mode still mints a genuine, bank-payable QR Ph code — PayMongo's
        own testing guide says so in as many words. Scanning it in GCash moves
        real money out of a real account, which is the opposite of what anyone
        clicking around a test build expects. So the warning sits above the
        code, not below it, and the safe path is a button.
      */}
      {payment.testMode ? (
        <div className="mt-5 rounded-2xl bg-status-warning-bg p-4 text-left">
          <p className="text-base font-semibold text-status-warning">
            Test mode — do not scan this code
          </p>
          <p className="mt-1 text-base text-status-warning">
            PayMongo issues a real QR Ph code even under a test key. Scanning it
            in GCash or a bank app takes real money.
          </p>
          {/*
            The link only comes back on the reply that created the attempt, so
            after a reload there is nothing to click. The warning above is not
            conditional on it — the code is just as live either way.
          */}
          {payment.testUrl ? (
            <Button
              variant="pill"
              className="mt-3 h-11 w-full text-base font-semibold"
              asChild
            >
              <a href={payment.testUrl} target="_blank" rel="noopener noreferrer">
                Simulate payment
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onRetry}
              className="mt-3 h-11 w-full rounded-full border-status-warning/40 text-base font-semibold text-status-warning"
            >
              Get a fresh code to simulate
            </Button>
          )}
        </div>
      ) : null}

      <div
        className={cn(
          "mx-auto mt-6 w-full max-w-90 rounded bg-white p-3 ring-1 ring-line",
          /* Dimmed in test mode so the code reads as a specimen rather than an
             invitation to scan. */
          payment.testUrl && "opacity-40"
        )}
      >
        <AppImage
          src={payment.qrImageUrl}
          alt="QR Ph code for this order"
          priority
          className="aspect-square w-full object-contain"
        />
      </div>

      <p className="mt-5 text-4xl font-semibold text-ink">
        {currencyFormatter.format(payment.amountCents / 100)}
      </p>
      <p className="mt-1 text-base text-ink-soft">
        Order {payment.orderNumber}
      </p>

      <div className="mt-5 flex justify-center">
        <DotPulse label="Waiting for your payment" />
      </div>

      {countdown ? (
        <p className="mt-2 text-base text-ink-soft">
          This code expires in{" "}
          <span className="font-semibold text-ink tabular-nums">
            {countdown}
          </span>
        </p>
      ) : null}

      <p className="mt-5 text-base text-ink-soft">
        Keep this page open, it updates on its own once your bank confirms.
      </p>

      <Button
        variant="outline"
        className="mt-8 h-12 w-[60%] rounded-full border-ink/20 bg-neutral-50 text-base"
        asChild
      >
        <Link to={orderHref}>I&apos;ll pay later</Link>
      </Button>
    </>
  )
}

function Outcome({
  tone,
  title,
  body,
  action,
}: {
  tone: "success" | "warning"
  title: string
  body: string
  action?: React.ReactNode
}) {
  const Icon = tone === "success" ? CheckCircleIcon : WarningCircleIcon
  return (
    <div className="flex flex-col items-center py-6">
      <Icon
        size={56}
        weight="fill"
        aria-hidden
        className={cn(
          tone === "success" ? "text-status-success" : "text-brand"
        )}
      />
      <h1 className="mt-4 font-heading text-2xl font-medium text-ink">
        {title}
      </h1>
      <p className="mt-2 text-base text-ink-soft">{body}</p>
      {action ? <div className="mt-7 w-full">{action}</div> : null}
    </div>
  )
}
