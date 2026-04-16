import { useEffect, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { cartItems } from "@/features/cart/data/cartItems"
import { AnimatePresence, motion } from "motion/react"

type CartSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value)
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }, [])

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
            className="fixed inset-0 z-40 bg-black/30"
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
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="fixed top-0 right-0 z-50 flex h-svh w-full max-w-md flex-col border-l border-black/10 bg-white sm:w-md"
          >
            <header className="flex items-center justify-between border-b border-black/10 px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-heading text-2xl text-zinc-950">
                  Your Cart
                </h2>
                <p className="text-sm text-zinc-600">
                  Review your selected items.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded px-3"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5">
              <ul className="divide-y divide-black/10">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase">
                          {item.category}
                        </p>
                        <p className="mt-1 text-base font-medium text-zinc-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-600">
                          Qty {item.quantity}
                        </p>
                      </div>

                      <p className="text-base font-medium text-zinc-950">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-black/10 px-4 py-4 sm:px-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-zinc-600">Subtotal</p>
                <p className="text-xl font-semibold text-zinc-950">
                  {formatCurrency(subtotal)}
                </p>
              </div>

              <div className="grid gap-2">
                <Button className="h-11 rounded bg-zinc-900 text-white hover:bg-zinc-800">
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded border-zinc-300"
                >
                  View Full Cart
                </Button>
              </div>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
