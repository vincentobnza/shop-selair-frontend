import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CaretLeftIcon, TagIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import {
  AddressFields,
  EMPTY_ADDRESS,
  validateAddress,
  type AddressFormValue,
} from "@/components/address/AddressFields"
import { LineReservationDates } from "@/components/cart/LineReservationDates"
import { SITE_LOGO_TEXT } from "@/components/layout/nav-config"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { Input } from "@/components/ui/input"
import { toUserMessage } from "@/features/auth/errors"
import { useAddresses } from "@/features/addresses/queries"
import { useAuth } from "@/features/auth/hooks"
import { useCartStore } from "@/features/cart/cartStore"
import { useCreateOrder } from "@/features/orders/queries"
import type { CreateOrderInput } from "@/features/orders/types"
import { previewVoucher, type VoucherPreview } from "@/features/vouchers/api"
import { formatPhpFromCents } from "@/lib/money"
import { cn } from "@/lib/utils"

// Mirrors the backend pricing rules (common/domain/pricing.ts).
const SHIPPING_FLAT_CENTS = 7900
const FREE_SHIPPING_THRESHOLD_CENTS = 200000

function computeShipping(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS
}

type LocationState = { backTo?: string }
function safeBackPath(state: unknown): string {
  if (state && typeof state === "object" && "backTo" in state) {
    const v = (state as LocationState).backTo
    if (typeof v === "string" && v.startsWith("/") && !v.startsWith("//")) return v
  }
  return "/shop"
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const backTo = useMemo(() => safeBackPath(location.state), [location.state])

  const { isAuthenticated } = useAuth()
  const apiCart = useCartStore((s) => s.apiCart)
  const reservationByProductKey = useCartStore((s) => s.reservationByProductKey)
  const loading = useCartStore((s) => s.loading)
  const load = useCartStore((s) => s.load)

  const { data: addresses = [] } = useAddresses(isAuthenticated)
  const createOrder = useCreateOrder()

  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new")
  const [newAddress, setNewAddress] = useState<AddressFormValue>(EMPTY_ADDRESS)
  const [saveAddress, setSaveAddress] = useState(true)
  const [addressErrors, setAddressErrors] = useState<Record<string, string[]>>({})
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
  const [notes, setNotes] = useState("")

  const [voucherInput, setVoucherInput] = useState("")
  const [voucher, setVoucher] = useState<VoucherPreview | null>(null)
  const [voucherError, setVoucherError] = useState<string | null>(null)
  const [voucherPending, setVoucherPending] = useState(false)

  useEffect(() => {
    if (isAuthenticated) void load()
  }, [isAuthenticated, load])

  // Default to the user's default/first saved address when available.
  useEffect(() => {
    if (addresses.length > 0) {
      const def = addresses.find((a) => a.is_default) ?? addresses[0]
      setSelectedAddressId(def.id)
    } else {
      setSelectedAddressId("new")
    }
  }, [addresses])

  const items = apiCart?.items ?? []
  const subtotalCents = apiCart?.subtotal_cents ?? 0
  const discountCents = voucher?.discount_cents ?? 0
  const shippingCents = computeShipping(subtotalCents)
  const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents)

  const applyVoucher = async () => {
    const code = voucherInput.trim()
    if (!code) return
    setVoucherPending(true)
    setVoucherError(null)
    try {
      const preview = await previewVoucher(code, subtotalCents)
      setVoucher(preview)
      toast.success(`Voucher ${preview.code} applied.`)
    } catch (e) {
      setVoucher(null)
      setVoucherError(toUserMessage(e))
    } finally {
      setVoucherPending(false)
    }
  }

  const removeVoucher = () => {
    setVoucher(null)
    setVoucherInput("")
    setVoucherError(null)
  }

  const buildRentals = (): CreateOrderInput["rentals"] => {
    const rentals: NonNullable<CreateOrderInput["rentals"]> = []
    for (const line of items) {
      const key = `${line.product_id}::${line.size_label ?? ""}`
      const res = reservationByProductKey[key]
      if (res?.start && res?.end) {
        rentals.push({ cart_item_id: line.id, rental_start: res.start, rental_end: res.end })
      }
    }
    return rentals.length > 0 ? rentals : undefined
  }

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault()

    const payload: CreateOrderInput = {
      payment_method: paymentMethod,
      notes: notes.trim() || undefined,
      voucher_code: voucher?.code,
      rentals: buildRentals(),
    }

    if (selectedAddressId !== "new") {
      payload.address_id = selectedAddressId
    } else {
      const errs = validateAddress(newAddress)
      if (Object.keys(errs).length > 0) {
        setAddressErrors(errs)
        toast.error("Please complete your delivery address.")
        return
      }
      payload.recipient_name = newAddress.recipient_name
      payload.phone = newAddress.phone
      payload.line1 = newAddress.line1
      payload.line2 = newAddress.line2 || undefined
      payload.city = newAddress.city
      payload.region = newAddress.region
      payload.postal_code = newAddress.postal_code
      payload.save_address = saveAddress
    }

    createOrder.mutate(payload, {
      onSuccess: async (order) => {
        await load() // refresh the (now empty) cart
        toast.success("Order placed!")
        navigate(`/account/orders/${order.id}?placed=1`, { replace: true })
      },
      onError: (err) => toast.error(toUserMessage(err)),
    })
  }

  // ----- guards / states -----
  if (!isAuthenticated) {
    return (
      <CheckoutShell backTo={backTo} navigate={navigate}>
        <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center">
          <p className="font-heading text-lg text-zinc-900">Sign in to check out</p>
          <p className="mt-2 text-sm text-zinc-600">
            Log in to place your order securely and track it in your account.
          </p>
          <Button className="mt-6 h-11 w-full max-w-xs rounded-full" asChild>
            <Link to="/login" state={{ backTo: "/checkout" }}>
              Sign in
            </Link>
          </Button>
          <p className="mt-3 text-sm text-zinc-500">
            New here?{" "}
            <Link to="/signup" className="font-medium text-zinc-800 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </CheckoutShell>
    )
  }

  if ((loading || apiCart === null)) {
    return (
      <CheckoutShell backTo={backTo} navigate={navigate}>
        <div className="flex min-h-[40vh] items-center justify-center">
          <DotPulse size="lg" />
        </div>
      </CheckoutShell>
    )
  }

  if (items.length === 0) {
    return (
      <CheckoutShell backTo={backTo} navigate={navigate}>
        <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center">
          <p className="font-heading text-lg text-zinc-900">Your bag is empty</p>
          <p className="mt-2 text-sm text-zinc-600">Add something you love before checking out.</p>
          <Button className="mt-6 h-11 w-full max-w-xs rounded-full" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </CheckoutShell>
    )
  }

  return (
    <CheckoutShell backTo={backTo} navigate={navigate}>
      <form
        onSubmit={placeOrder}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start lg:gap-10 xl:gap-14"
      >
        <section className="order-2 space-y-8 lg:order-1">
          <div>
            <h1 className="font-heading text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-zinc-600">Delivery, payment, and you’re done.</p>
          </div>

          {/* Delivery address */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">Delivery address</p>
            <div className="mt-4 space-y-3">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition",
                    selectedAddressId === a.id
                      ? "border-zinc-900 ring-1 ring-zinc-900"
                      : "border-neutral-200 hover:border-neutral-300",
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 accent-zinc-900"
                    checked={selectedAddressId === a.id}
                    onChange={() => setSelectedAddressId(a.id)}
                  />
                  <span className="min-w-0 text-sm">
                    <span className="font-medium text-zinc-900">
                      {a.recipient_name}
                      {a.label ? ` · ${a.label}` : ""}
                      {a.is_default ? " · Default" : ""}
                    </span>
                    <span className="mt-0.5 block text-zinc-600">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.region} {a.postal_code}
                    </span>
                    <span className="text-zinc-500">{a.phone}</span>
                  </span>
                </label>
              ))}

              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition",
                  selectedAddressId === "new"
                    ? "border-zinc-900 ring-1 ring-zinc-900"
                    : "border-neutral-200 hover:border-neutral-300",
                )}
              >
                <input
                  type="radio"
                  name="address"
                  className="accent-zinc-900"
                  checked={selectedAddressId === "new"}
                  onChange={() => setSelectedAddressId("new")}
                />
                <span className="text-sm font-medium text-zinc-900">Use a new address</span>
              </label>

              {selectedAddressId === "new" ? (
                <div className="rounded-lg border border-neutral-200 p-4">
                  <AddressFields
                    value={newAddress}
                    onChange={(patch) => setNewAddress((s) => ({ ...s, ...patch }))}
                    errors={addressErrors}
                    showLabel={false}
                  />
                  <label className="mt-4 flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      className="accent-zinc-900"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    Save this address for next time
                  </label>
                </div>
              ) : null}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">Payment</p>
            <div className="mt-4 space-y-3">
              <PaymentOption
                checked={paymentMethod === "cod"}
                onSelect={() => setPaymentMethod("cod")}
                title="Cash on Delivery"
                subtitle="Pay in cash when your order arrives."
              />
              <PaymentOption
                checked={paymentMethod === "online"}
                onSelect={() => setPaymentMethod("online")}
                title="Online payment"
                subtitle="Simulated secure payment (demo)."
              />
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
              Delivery notes <span className="lowercase">(optional)</span>
            </p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code, landmarks, delivery window…"
              className="mt-3 min-h-20 w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus-visible:border-neutral-400 focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </section>

        {/* Summary */}
        <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <h2 className="font-heading text-lg font-medium text-zinc-950">Order summary</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>

            <ul className="max-h-[min(46vh,380px)] divide-y divide-neutral-100 overflow-y-auto px-5 sm:px-6">
              {items.map((line) => {
                const res = reservationByProductKey[`${line.product_id}::${line.size_label ?? ""}`]
                return (
                  <li key={line.id} className="flex gap-4 py-4">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {line.product?.images?.[0] ? (
                        <AppImage
                          src={line.product.images[0]}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                        {line.size_label ? `Size ${line.size_label}` : "Shop"}
                      </p>
                      <p className="mt-0.5 text-sm leading-snug font-medium text-zinc-900">
                        {line.product?.name ?? "Product"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">Qty {line.quantity}</p>
                      <LineReservationDates start={res?.start} end={res?.end} className="text-zinc-600" />
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-zinc-950 tabular-nums">
                      {formatPhpFromCents((line.product?.price_cents ?? 0) * line.quantity)}
                    </p>
                  </li>
                )
              })}
            </ul>

            {/* Voucher */}
            <div className="border-t border-neutral-100 px-5 py-4 sm:px-6">
              {voucher ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
                    <TagIcon size={16} weight="fill" /> {voucher.code}
                  </span>
                  <button
                    type="button"
                    onClick={removeVoucher}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="Voucher code"
                    className="h-10 flex-1 uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-lg"
                    onClick={applyVoucher}
                    disabled={voucherPending || !voucherInput.trim()}
                  >
                    {voucherPending ? "…" : "Apply"}
                  </Button>
                </div>
              )}
              {voucherError ? <p className="mt-2 text-xs text-red-700">{voucherError}</p> : null}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 border-t border-neutral-100 px-5 py-5 text-sm sm:px-6">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatPhpFromCents(subtotalCents)}
                </span>
              </div>
              {discountCents > 0 ? (
                <div className="flex justify-between">
                  <span className="text-zinc-600">Discount</span>
                  <span className="font-medium text-emerald-700 tabular-nums">
                    −{formatPhpFromCents(discountCents)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className="text-zinc-900 tabular-nums">
                  {shippingCents === 0 ? "Free" : formatPhpFromCents(shippingCents)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="font-medium text-zinc-800">Total</span>
                <span className="text-lg font-semibold text-zinc-950 tabular-nums">
                  {formatPhpFromCents(totalCents)}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createOrder.isPending}
            className="mt-4 h-14 w-full rounded-full px-8 text-base font-medium"
          >
            {createOrder.isPending
              ? "Placing order…"
              : `Place order · ${formatPhpFromCents(totalCents)}`}
          </Button>
        </aside>
      </form>
    </CheckoutShell>
  )
}

function CheckoutShell({
  backTo,
  navigate,
  children,
}: {
  backTo: string
  navigate: (to: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-neutral-50 text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="relative flex min-h-14 items-center justify-center px-4 sm:min-h-16 sm:px-6">
          <div className="absolute left-4 sm:left-6">
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 touch-manipulation gap-1.5 px-2 text-zinc-700 sm:px-3"
              onClick={() => navigate(backTo)}
            >
              <CaretLeftIcon className="size-5" weight="bold" />
              <span className="text-sm font-medium">Back</span>
            </Button>
          </div>
          <Link
            to="/"
            className="text-center font-logo text-sm font-medium tracking-wide text-black uppercase sm:text-base"
          >
            {SITE_LOGO_TEXT}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">{children}</main>
    </div>
  )
}

function PaymentOption({
  checked,
  onSelect,
  title,
  subtitle,
}: {
  checked: boolean
  onSelect: () => void
  title: string
  subtitle: string
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition",
        checked ? "border-zinc-900 ring-1 ring-zinc-900" : "border-neutral-200 hover:border-neutral-300",
      )}
    >
      <input
        type="radio"
        name="payment"
        className="mt-1 accent-zinc-900"
        checked={checked}
        onChange={onSelect}
      />
      <span className="text-sm">
        <span className="font-medium text-zinc-900">{title}</span>
        <span className="mt-0.5 block text-zinc-500">{subtitle}</span>
      </span>
    </label>
  )
}
