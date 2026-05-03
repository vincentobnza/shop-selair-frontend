import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CaretLeftIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { LineReservationDates } from "@/components/cart/LineReservationDates"
import { SITE_LOGO_TEXT } from "@/components/layout/nav-config"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/hooks"
import { useCartStore } from "@/features/cart/cartStore"
import type { ApiCartLine } from "@/features/cart/types"
import { useCatalogProducts } from "@/features/products/queries"
import { cn } from "@/lib/utils"

function formatPhpFromCents(cents: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatPhpAmount(pesos: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(pesos)
}

type LocationState = { backTo?: string }

function safeBackPath(state: unknown): string {
  if (!state || typeof state !== "object" || !("backTo" in state)) {
    return "/shop"
  }
  const v = (state as LocationState).backTo
  if (typeof v !== "string") return "/shop"
  const p = v.trim()
  if (p.startsWith("/") && !p.startsWith("//")) return p
  return "/shop"
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const backTo = useMemo(
    () => safeBackPath(location.state),
    [location.state],
  )

  const { isAuthenticated } = useAuth()
  const apiCart = useCartStore((s) => s.apiCart)
  const guestLines = useCartStore((s) => s.guestLines)
  const reservationByProductKey = useCartStore(
    (s) => s.reservationByProductKey,
  )
  const loading = useCartStore((s) => s.loading)
  const load = useCartStore((s) => s.load)
  const { data: catalog = [] } = useCatalogProducts()

  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    notes: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      void load()
    }
  }, [isAuthenticated, load])

  const guestRows = useMemo(() => {
    return guestLines.map((line) => {
      const p = catalog.find((x) => x.id === line.productId)
      const sz = line.size ?? ""
      const img = p?.image?.[0]
      return {
        key: `${line.productId}::${sz}`,
        productId: line.productId,
        title: p?.name ?? "Product",
        subtitle: sz ? `Size ${sz}` : "Shop",
        quantity: line.quantity,
        lineTotal: (p?.price ?? 0) * line.quantity,
        imageUrl: img,
        rentalStart: line.rentalStart,
        rentalEnd: line.rentalEnd,
      }
    })
  }, [guestLines, catalog])

  const apiRows = useMemo(() => apiCart?.items ?? [], [apiCart])

  const guestPesosTotal = useMemo(
    () => guestRows.reduce((s, r) => s + r.lineTotal, 0),
    [guestRows],
  )

  const subtotalLabel = useMemo(() => {
    if (!isAuthenticated) {
      return formatPhpAmount(guestPesosTotal)
    }
    return formatPhpAmount((apiCart?.subtotal_cents ?? 0) / 100 + guestPesosTotal)
  }, [isAuthenticated, apiCart, guestPesosTotal])

  const authPending = isAuthenticated && apiCart === null
  const showEmptyAuth =
    isAuthenticated &&
    apiCart !== null &&
    apiRows.length === 0 &&
    guestLines.length === 0 &&
    !loading
  const showGuestEmpty = !isAuthenticated && guestLines.length === 0
  const showFullEmpty = showEmptyAuth || showGuestEmpty
  const showLoader = (loading || authPending) && isAuthenticated

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.message("Checkout isn’t live yet", {
      description: "We’ll email you when online orders open.",
    })
  }

  const inputClass =
    "h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200"

  const notesClass =
    "min-h-[88px] w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 md:text-sm"

  return (
    <div className="min-h-svh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="relative flex min-h-14 items-center justify-center px-4 sm:min-h-16 sm:px-6">
          <div className="absolute left-4 sm:left-6">
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 touch-manipulation gap-1.5 px-2 text-neutral-700 sm:px-3"
              onClick={() => navigate(backTo)}
            >
              <CaretLeftIcon className="size-5" weight="bold" />
              <span className="text-sm font-medium">Back</span>
            </Button>
          </div>

          <Link
            to="/"
            className="font-heading text-center text-sm font-normal uppercase tracking-wide text-neutral-900 sm:text-base"
          >
            {SITE_LOGO_TEXT}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {showLoader ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <DotPulse size="lg" />
          </div>
        ) : showFullEmpty ? (
          <div className="mx-auto max-w-md  border border-neutral-200 bg-white px-6 py-12 text-center ">
            <p className="font-heading text-lg text-neutral-900">Your bag is empty</p>
            <p className="mt-2 text-sm text-neutral-600">
              Add something you love before checking out.
            </p>
            <Button className="mt-6 h-11 w-full max-w-xs rounded-full" asChild>
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start lg:gap-10 xl:gap-14">
            <section className="order-2 space-y-8 lg:order-1">
              <div>
                <h1 className="font-heading text-2xl font-medium tracking-tight text-neutral-950 sm:text-3xl">
                  Checkout
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Delivery details and contact — you’re almost done.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-8">
                <div className=" border border-neutral-200 bg-white p-5  sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Contact
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2 sm:col-span-2">
                      <span className="text-sm font-medium text-neutral-800">
                        Email
                      </span>
                      <Input
                        type="email"
                        name="checkout-email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, email: e.target.value }))
                        }
                        className={cn(inputClass, "md:text-sm")}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label className="block space-y-2 sm:col-span-2">
                      <span className="text-sm font-medium text-neutral-800">
                        Mobile number
                      </span>
                      <Input
                        type="tel"
                        name="checkout-phone"
                        autoComplete="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, phone: e.target.value }))
                        }
                        className={cn(inputClass, "md:text-sm")}
                        placeholder="+63 …"
                      />
                    </label>
                  </div>
                </div>

                <div className=" border border-neutral-200 bg-white p-5  sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Delivery
                  </p>
                  <div className="mt-4 grid gap-4">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-neutral-800">
                        Full name
                      </span>
                      <Input
                        name="checkout-name"
                        autoComplete="name"
                        required
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, fullName: e.target.value }))
                        }
                        className={cn(inputClass, "md:text-sm")}
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-neutral-800">
                        Address line 1
                      </span>
                      <Input
                        name="checkout-line1"
                        autoComplete="address-line1"
                        required
                        value={form.line1}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, line1: e.target.value }))
                        }
                        className={cn(inputClass, "md:text-sm")}
                        placeholder="Street, building, unit"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-neutral-800">
                        Address line 2{" "}
                        <span className="font-normal text-neutral-500">
                          (optional)
                        </span>
                      </span>
                      <Input
                        name="checkout-line2"
                        autoComplete="address-line2"
                        value={form.line2}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, line2: e.target.value }))
                        }
                        className={cn(inputClass, "md:text-sm")}
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="block space-y-2 sm:col-span-1">
                        <span className="text-sm font-medium text-neutral-800">
                          City
                        </span>
                        <Input
                          name="checkout-city"
                          autoComplete="address-level2"
                          required
                          value={form.city}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, city: e.target.value }))
                          }
                          className={cn(inputClass, "md:text-sm")}
                        />
                      </label>
                      <label className="block space-y-2 sm:col-span-1">
                        <span className="text-sm font-medium text-neutral-800">
                          Province / Region
                        </span>
                        <Input
                          name="checkout-region"
                          autoComplete="address-level1"
                          required
                          value={form.region}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, region: e.target.value }))
                          }
                          className={cn(inputClass, "md:text-sm")}
                        />
                      </label>
                      <label className="block space-y-2 sm:col-span-1">
                        <span className="text-sm font-medium text-neutral-800">
                          Postal code
                        </span>
                        <Input
                          name="checkout-postal"
                          autoComplete="postal-code"
                          required
                          value={form.postal}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, postal: e.target.value }))
                          }
                          className={cn(inputClass, "md:text-sm")}
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                      <span className="shrink-0 pt-0.5 text-sm font-medium text-neutral-800 sm:w-40 sm:pt-2.5 lg:w-44">
                        Delivery notes{" "}
                        <span className="font-normal text-neutral-500">
                          (optional)
                        </span>
                      </span>
                      <textarea
                        name="checkout-notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, notes: e.target.value }))
                        }
                        className={notesClass}
                        placeholder="Gate code, landmarks, delivery window…"
                      />
                    </label>
                  </div>
                </div>



                <Button
                  type="submit"
                  className="h-14 w-full rounded-full px-8 text-base font-medium"
                >
                  Place order
                </Button>
              </form>
            </section>

            <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
              <div className=" border border-neutral-200 bg-white ">
                <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
                  <h2 className="font-heading text-lg font-medium text-neutral-950">
                    Order summary
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {apiRows.length + guestRows.length}{" "}
                    {apiRows.length + guestRows.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <ul className="max-h-[min(52vh,420px)] divide-y divide-neutral-100 overflow-y-auto px-5 sm:px-6">
                  {isAuthenticated && apiRows.length > 0
                    ? apiRows.map((line: ApiCartLine) => {
                      const cat = catalog.find(
                        (c) => c.id === String(line.product_id),
                      )
                      const img = cat?.image?.[0]
                      const product = line.product
                      const name = product?.name ?? "Product unavailable"
                      const unitCents = product?.price_cents ?? 0
                      const resKey = `${line.product_id}::${line.size_label ?? ""}`
                      const res = reservationByProductKey[resKey]
                      return (
                        <li key={line.id} className="flex gap-4 py-4">
                          <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                            {img ? (
                              <img
                                src={img}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="size-full bg-neutral-200/80" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                              {line.size_label
                                ? `Size ${line.size_label}`
                                : "Shop"}
                            </p>
                            <p className="mt-0.5 text-sm font-medium leading-snug text-neutral-900">
                              {name}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              Qty {line.quantity}
                            </p>
                            <LineReservationDates
                              start={res?.start}
                              end={res?.end}
                              className="text-neutral-600"
                            />
                          </div>
                          <p className="shrink-0 text-sm font-semibold text-neutral-950 tabular-nums">
                            {formatPhpFromCents(unitCents * line.quantity)}
                          </p>
                        </li>
                      )
                    })
                    : null}

                  {guestRows.length > 0
                    ? guestRows.map((row) => (
                      <li key={row.key} className="flex gap-4 py-4">
                        <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          {row.imageUrl ? (
                            <img
                              src={row.imageUrl}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="size-full bg-neutral-200/80" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                            {row.subtitle}
                          </p>
                          <p className="mt-0.5 text-sm font-medium leading-snug text-neutral-900">
                            {row.title}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Qty {row.quantity}
                          </p>
                          <LineReservationDates
                            start={row.rentalStart}
                            end={row.rentalEnd}
                            className="text-neutral-600"
                          />
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-neutral-950 tabular-nums">
                          {formatPhpAmount(row.lineTotal)}
                        </p>
                      </li>
                    ))
                    : null}
                </ul>

                <div className="space-y-3 border-t border-neutral-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold tabular-nums text-neutral-950">
                      {subtotalLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-neutral-500">Calculated next</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-sm font-medium text-neutral-800">
                      Total
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-neutral-950">
                      {subtotalLabel}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-neutral-500 lg:text-left">
                Questions?{" "}
                <Link
                  to="/"
                  className="font-medium text-neutral-800 underline-offset-2 hover:underline"
                >
                  Contact Selair
                </Link>
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
