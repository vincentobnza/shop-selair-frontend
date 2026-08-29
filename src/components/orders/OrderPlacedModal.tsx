import { CopyIcon, XIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Order } from "@/features/orders/types"
import { paymentMethodLabel } from "@/features/orders/status"
import { formatPhpFromCents } from "@/lib/money"
import { cn } from "@/lib/utils"

type OrderPlacedModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order
}

/**
 * The receipt moment, right after checkout.
 *
 * It states three things a customer wants in the first two seconds — it worked,
 * what it cost, and what happens next — and nothing else. The order number is
 * the one piece they may need to quote back to us, so it is set apart and
 * copyable rather than buried in a sentence.
 *
 * Dismissing lands them on the full order behind it, so closing the dialog is
 * never a dead end and the modal never has to repeat the whole order.
 */
export function OrderPlacedModal({
  open,
  onOpenChange,
  order,
}: OrderPlacedModalProps) {
  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.order_number)
      toast.success("Order number copied.")
    } catch {
      // Clipboard access is denied over plain HTTP and in some in-app
      // browsers. The number is on screen either way, so this is a nudge,
      // not a failure worth alarming anyone about.
      toast.error("Couldn’t copy — you can select the number instead.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0!"
        // The success mark, not the close button, should greet them.
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogClose
          type="button"
          aria-label="Close"
          className={cn(
            "absolute top-4 right-4 flex size-9 touch-manipulation items-center justify-center rounded-full text-ink-soft transition-colors",
            "outline-none hover:bg-pink-light hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20"
          )}
        >
          <XIcon className="size-4" weight="bold" />
        </DialogClose>

        <div className="px-6 pt-9 pb-6 text-center">
          <img
            src="/check.png"
            loading="lazy"
            alt="success-checkout-icon"
            className="mx-auto size-16 sm:size-18 md:size-20 lg:size-22"
          />
          <DialogTitle className="mt-8 text-2xl font-medium tracking-tight text-ink">
            Order confirmed
          </DialogTitle>
          <DialogDescription className="mx-auto mt-2 max-w-xs text-base text-ink-soft">
            Thank you. We’ve received your order!
          </DialogDescription>

          {/*
            The two facts worth restating outside the page behind: which order
            this was, and what was charged.
          */}
          <dl className="mt-6 space-y-3 rounded-2xl bg-pink-light/60 p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-base text-ink-soft">Order number</dt>
              <dd className="flex min-w-0 items-center gap-1">
                <span className="truncate font-medium text-ink tabular-nums">
                  {order.order_number}
                </span>
                <button
                  type="button"
                  onClick={() => void copyOrderNumber()}
                  aria-label={`Copy order number ${order.order_number}`}
                  className={cn(
                    "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors",
                    "outline-none hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20"
                  )}
                >
                  <CopyIcon className="size-4" />
                </button>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-base text-ink-soft">Total</dt>
              <dd className="font-semibold text-ink tabular-nums">
                {formatPhpFromCents(order.total_cents)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-base text-ink-soft">Payment</dt>
              <dd className="text-base text-ink">
                {paymentMethodLabel(order.payment_method)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2">
            <DialogClose asChild>
              <Button variant="pill" size="lg" className="w-full">
                View order details
              </Button>
            </DialogClose>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="w-full rounded-full text-ink-soft hover:text-ink"
            >
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
