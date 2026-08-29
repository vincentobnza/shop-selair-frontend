import { useEffect, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LineReservationDates } from "@/components/cart/LineReservationDates"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks"
import { useCartStore } from "@/features/cart/cartStore"
import { useCatalogProducts } from "@/features/products/queries"
import { AnimatePresence, motion } from "motion/react"
import { XIcon } from "@phosphor-icons/react"
import type { ApiCartLine } from "@/features/cart/types"
import EmptyStateImage from "@/assets/empty_shopping_cart.png"
import { DotPulse } from "../ui/dot-pulse"

type CartSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { isAuthenticated } = useAuth()
  const apiCart = useCartStore((s) => s.apiCart)
  const guestLines = useCartStore((s) => s.guestLines)
  const reservationByProductKey = useCartStore((s) => s.reservationByProductKey)
  const loading = useCartStore((s) => s.loading)
  const load = useCartStore((s) => s.load)
  const removeApiLine = useCartStore((s) => s.removeApiLine)
  const removeGuestLine = useCartStore((s) => s.removeGuestLine)
  const clearApi = useCartStore((s) => s.clearApi)
  const clearGuest = useCartStore((s) => s.clearGuest)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: catalog = [] } = useCatalogProducts()

  useEffect(() => {
    if (open && isAuthenticated) {
      void load()
    }
  }, [open, isAuthenticated, load])

  const guestRows = useMemo(() => {
    return guestLines.map((line) => {
      const p = catalog.find((x) => x.id === line.productId)
      const sz = line.size ?? ""
      return {
        key: `${line.productId}::${sz}`,
        productId: line.productId,
        size: sz,
        title: p?.name ?? "Product",
        subtitle: sz ? `Size ${sz}` : "Shop",
        quantity: line.quantity,
        lineTotal: (p?.price ?? 0) * line.quantity,
        imageUrl: p?.image?.[0],
        rentalStart: line.rentalStart,
        rentalEnd: line.rentalEnd,
      }
    })
  }, [guestLines, catalog])

  const apiRows = useMemo(() => apiCart?.items ?? [], [apiCart])

  const guestPesosTotal = useMemo(
    () => guestRows.reduce((s, r) => s + r.lineTotal, 0),
    [guestRows]
  )

  const subtotal = useMemo(() => {
    if (!isAuthenticated) {
      return formatPhpAmount(guestPesosTotal)
    }
    const apiPesos = (apiCart?.subtotal_cents ?? 0) / 100
    return formatPhpAmount(apiPesos + guestPesosTotal)
  }, [isAuthenticated, apiCart, guestPesosTotal])

  const showEmptyAuth =
    isAuthenticated &&
    apiCart !== null &&
    apiRows.length === 0 &&
    guestLines.length === 0 &&
    !loading
  const showGuestEmpty = !isAuthenticated && guestLines.length === 0
  const hasBagItems = apiRows.length > 0 || guestRows.length > 0
  const showFullBagEmpty = showEmptyAuth || showGuestEmpty

  const authCartLoading = isAuthenticated && loading

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onOpenChange])

  const handleContinueShopping = () => {
    void onOpenChange(false)
    navigate("/shop")
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-99 bg-black/30"
          />

          <motion.aside
            id="cart-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.26,
            }}
            className="fixed top-0 right-0 z-99 flex h-svh w-full max-w-md flex-col rounded-l-[1.75rem] bg-white sm:w-md"
          >
            <header className="flex items-center justify-between px-6 py-5">
              <div>
                <h2 className="text-2xl font-medium text-ink">My Bag</h2>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close cart"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full text-brand transition-colors hover:bg-pink-light"
              >
                <XIcon size={22} weight="bold" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {authCartLoading ? (
                <div className="flex min-h-[calc(100vh-250px)] items-center justify-center">
                  <DotPulse size="lg" />
                </div>
              ) : (
                <>
                  {showFullBagEmpty ? (
                    <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center space-y-4">
                      <AppImage
                        src={EmptyStateImage}
                        alt="Empty shopping cart"
                        className="mb-8 h-24 w-24 sm:mb-12 md:mb-16"
                      />{" "}
                      <h2 className="text-center text-lg font-medium text-ink">
                        Looks like your shopping bag is empty.
                        {!isAuthenticated ? (
                          <> Sign in to sync your cart across devices.</>
                        ) : null}
                      </h2>
                      <Button
                        variant="outline"
                        className="mt-3 h-11 rounded-full px-8"
                        onClick={handleContinueShopping}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : null}

                  {isAuthenticated && apiRows.length > 0 ? (
                    <ul className="flex flex-col gap-6">
                      {apiRows.map((line: ApiCartLine) => {
                        const resKey = `${line.product_id}::${line.size_label ?? ""}`
                        const res = reservationByProductKey[resKey]
                        const name = line.product?.name ?? "Product unavailable"
                        const unitCents = line.product?.price_cents ?? 0
                        const cat = catalog.find(
                          (c) => c.id === String(line.product_id)
                        )
                        const img = cat?.image?.[0]
                        return (
                          <li key={line.id} className="py-4">
                            <div className="flex gap-4">
                              <div className="size-16 shrink-0 overflow-hidden bg-pink-light sm:size-20">
                                {img ? (
                                  <AppImage
                                    src={img}
                                    alt=""
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="size-full bg-pink-light" />
                                )}
                              </div>
                              <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                                <div>
                                  <p className="text-base font-medium text-ink-soft">
                                    {line.size_label
                                      ? `Size ${line.size_label}`
                                      : "Shop"}
                                  </p>
                                  <p className="mt-1 text-base font-medium text-ink">
                                    {name}
                                  </p>
                                  <p className="mt-1 text-base text-ink-soft">
                                    Qty {line.quantity}
                                  </p>
                                  <LineReservationDates
                                    start={res?.start}
                                    end={res?.end}
                                    className="text-ink-soft"
                                  />
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-base font-medium text-ink tabular-nums">
                                    {formatPhpFromCents(
                                      unitCents * line.quantity
                                    )}
                                  </p>
                                  <button
                                    type="button"
                                    className="mt-2 text-base font-medium text-ink-soft underline"
                                    onClick={() => void removeApiLine(line.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}

                  {guestRows.length > 0 ? (
                    <div
                      className={
                        isAuthenticated && apiRows.length > 0 ? "mt-6 pt-6" : ""
                      }
                    >
                      <ul className="flex flex-col gap-6">
                        {guestRows.map((row) => (
                          <li key={row.key} className="py-4">
                            <div className="flex gap-4">
                              <div className="size-16 shrink-0 overflow-hidden bg-pink-light sm:size-20">
                                {row.imageUrl ? (
                                  <AppImage
                                    src={row.imageUrl}
                                    alt=""
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="size-full bg-pink-light" />
                                )}
                              </div>
                              <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                                <div>
                                  <p className="text-base font-medium text-ink-soft">
                                    {row.subtitle}
                                  </p>
                                  <p className="mt-1 text-base font-medium text-ink">
                                    {row.title}
                                  </p>
                                  <p className="mt-1 text-base text-ink-soft">
                                    Qty {row.quantity}
                                  </p>
                                  <LineReservationDates
                                    start={row.rentalStart}
                                    end={row.rentalEnd}
                                    className="text-ink-soft"
                                  />
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-base font-medium text-ink tabular-nums">
                                    {formatPhpAmount(row.lineTotal)}
                                  </p>
                                  <button
                                    type="button"
                                    className="mt-2 text-base font-medium text-ink-soft underline"
                                    onClick={() =>
                                      removeGuestLine(row.productId, row.size)
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {hasBagItems && !authCartLoading ? (
              <footer className="px-6 py-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-base text-ink-soft">Subtotal</p>{" "}
                  <p className="text-xl font-semibold text-ink">{subtotal}</p>
                </div>
                <div className="grid gap-2">
                  <Button variant="pill" className="h-12" asChild>
                    <Link
                      to="/checkout"
                      state={{ backTo: pathname }}
                      onClick={() => onOpenChange(false)}
                    >
                      Checkout
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full border-line"
                    onClick={() => {
                      if (isAuthenticated) {
                        void clearApi()
                      }
                      clearGuest()
                    }}
                  >
                    Clear bag
                  </Button>
                </div>
              </footer>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
