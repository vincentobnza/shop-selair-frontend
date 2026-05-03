import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks"
import { useCartStore } from "@/features/cart/cartStore"
import { useCatalogProducts } from "@/features/products/queries"
import { AnimatePresence, motion } from "motion/react"
import { XIcon } from "@phosphor-icons/react"

import type { ApiCartLine } from "@/features/cart/types"
import EmptyStateImage from '@/assets/empty_shopping_cart.png'
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
  const loading = useCartStore((s) => s.loading)
  const load = useCartStore((s) => s.load)
  const removeApiLine = useCartStore((s) => s.removeApiLine)
  const removeGuestLine = useCartStore((s) => s.removeGuestLine)
  const clearApi = useCartStore((s) => s.clearApi)
  const clearGuest = useCartStore((s) => s.clearGuest)
  const navigate = useNavigate()
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
      }
    })
  }, [guestLines, catalog])

  const apiRows = apiCart?.items ?? []

  const guestPesosTotal = useMemo(
    () => guestRows.reduce((s, r) => s + r.lineTotal, 0),
    [guestRows],
  )

  const subtotal = useMemo(() => {
    if (!isAuthenticated) {
      return formatPhpAmount(guestPesosTotal)
    }
    const apiPesos = (apiCart?.subtotal_cents ?? 0) / 100
    return formatPhpAmount(apiPesos + guestPesosTotal)
  }, [isAuthenticated, apiCart, guestPesosTotal])

  const authPending = isAuthenticated && apiCart === null
  const showEmptyAuth =
    isAuthenticated &&
    apiCart !== null &&
    apiRows.length === 0 &&
    guestLines.length === 0 &&
    !loading
  const showGuestEmpty = !isAuthenticated && guestLines.length === 0
  const hasBagItems = apiRows.length > 0 || guestRows.length > 0
  const showFullBagEmpty = showEmptyAuth || showGuestEmpty

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
            className="fixed top-0 right-0 z-99 flex h-svh w-full max-w-md flex-col border-l border-black/10 bg-white sm:w-md"
          >
            <header className="flex items-center justify-between border-b border-black/10 px-4 py-4 sm:px-5">
              <div>
                <h2 className="text-2xl font-medium text-zinc-950">My Bag</h2>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded px-3"
                onClick={() => onOpenChange(false)}
              >
                <XIcon className="size-7" />
                <span className="sr-only">Close</span>
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5">
              {(loading || authPending) && isAuthenticated ? (
                <div className="min-h-[calc(100vh-250px)] flex items-center justify-center">
                  <DotPulse size="lg" />
                </div>
              ) : null}

              {showFullBagEmpty ? (
                <div className="space-y-4 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
                  <img src={EmptyStateImage} alt="Empty shopping cart" className="w-24 h-24 mb-8 sm:mb-12 md:mb-16" />
                  <h2 className="text-sm sm:text-base md:text-lg font-medium text-black font-heading text-center">
                    Looks like your shopping bag is empty.
                    {!isAuthenticated ? (
                      <> Sign in to sync your cart across devices.</>
                    ) : null}
                  </h2>
                  <Button variant="outline" className="mt-3 h-11 rounded-full px-8" onClick={handleContinueShopping}>
                    Continue Shopping
                  </Button>
                </div>
              ) : null}

              {isAuthenticated && apiRows.length > 0 ? (
                <ul className="divide-y divide-black/10">
                  {apiRows.map((line: ApiCartLine) => (
                    <li key={line.id} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium text-zinc-500 uppercase">
                            {line.size_label ? `Size ${line.size_label}` : "Shop"}
                          </p>
                          <p className="mt-1 text-base font-medium text-zinc-900">
                            {line.product.name}
                          </p>
                          <p className="mt-1 text-sm text-zinc-600">
                            Qty {line.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-medium text-zinc-950">
                            {formatPhpFromCents(
                              line.product.price_cents * line.quantity,
                            )}
                          </p>
                          <button
                            type="button"
                            className="mt-2 text-xs font-medium text-zinc-500 underline"
                            onClick={() => void removeApiLine(line.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {guestRows.length > 0 ? (
                <div
                  className={
                    isAuthenticated && apiRows.length > 0
                      ? "mt-6 border-t border-black/10 pt-6"
                      : ""
                  }
                >

                  <ul className="divide-y divide-black/10">
                    {guestRows.map((row) => (
                      <li key={row.key} className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase">
                              {row.subtitle}
                            </p>
                            <p className="mt-1 text-base font-medium text-zinc-900">
                              {row.title}
                            </p>
                            <p className="mt-1 text-sm text-zinc-600">
                              Qty {row.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-base font-medium text-zinc-950">
                              {formatPhpAmount(row.lineTotal)}
                            </p>
                            <button
                              type="button"
                              className="mt-2 text-xs font-medium text-zinc-500 underline"
                              onClick={() =>
                                removeGuestLine(row.productId, row.size)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {hasBagItems ? (
              <footer className="border-t border-black/10 px-4 py-4 sm:px-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-zinc-600">Subtotal</p>
                  <p className="text-xl font-semibold text-zinc-950">
                    {subtotal}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Button className="h-11 rounded">Checkout</Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded border-zinc-300"
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
