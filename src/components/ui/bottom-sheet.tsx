import { useEffect, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

type BottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  children: ReactNode
  /** Actions that stay put while the body scrolls. */
  footer?: ReactNode
  className?: string
}

/**
 * The storefront's sheet: an overlay, a panel that rises from the bottom edge,
 * a grab handle, a scrolling body and a footer that stays put.
 *
 * The date picker established this shape, and it is the shape customers on this
 * site already know a decision arrives in — so anything else asking them for
 * something on a phone should arrive the same way rather than inventing a
 * second modal language.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: BottomSheetProps) {
  /* Escape closes it, and the page behind stops scrolling while it is up. */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
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
            aria-label={`Close ${title.toLowerCase()}`}
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-99 bg-black/50"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-99 flex max-h-[90svh] flex-col rounded-t-[1.75rem] bg-white sm:mx-auto sm:max-w-2xl",
              className
            )}
          >
            {/* Grab handle — the usual affordance for a sheet. */}
            <span
              aria-hidden
              className="mx-auto mt-3 block h-1 w-12 shrink-0 rounded-full bg-pink"
            />

            <header className="shrink-0 px-5 pt-4 text-center">
              <h2 className="font-heading text-2xl font-medium text-ink">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-base text-ink-soft">{description}</p>
              ) : null}
            </header>

            {/* Only the body scrolls, so the actions below stay reachable. */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">
              {children}
            </div>

            {footer ? (
              <div
                className="shrink-0 bg-white px-5 pt-4 pb-6"
                style={{
                  paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
                }}
              >
                {footer}
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
