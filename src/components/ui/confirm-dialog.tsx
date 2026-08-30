import type { ReactNode } from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ConfirmOptions = {
  title: string
  /** What will actually happen. Name the thing being changed. */
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Draws the confirm button in the destructive tone. */
  destructive?: boolean
}

type ConfirmDialogProps = ConfirmOptions & {
  open: boolean
  onResolve: (confirmed: boolean) => void
}

/**
 * A confirmation the storefront owns, rather than `window.confirm`.
 *
 * The same component the admin console uses, in the shop's own surface: the
 * native dialog freezes the tab, cannot name the order it is about to cancel in
 * the brand's voice, and looks like a browser error at the exact moment a
 * customer needs to trust what they are clicking.
 *
 * Escape and the overlay both cancel, and cancel takes focus first, so the
 * destructive path is never the one a stray Enter lands on.
 */
export function ConfirmDialog({
  open,
  onResolve,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
}: ConfirmDialogProps) {
  return (
    <AlertDialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onResolve(false)
      }}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-99 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-99 w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2",
            "overlay-surface outline-none",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in"
          )}
        >
          <AlertDialogPrimitive.Title className="font-heading text-2xl font-medium text-ink">
            {title}
          </AlertDialogPrimitive.Title>

          {description ? (
            <AlertDialogPrimitive.Description className="mt-2 text-base leading-relaxed text-ink-soft">
              {description}
            </AlertDialogPrimitive.Description>
          ) : null}

          {/*
            Confirm sits second on a phone and last in the row on a desktop, so
            the destructive action is never the first thing under a thumb.
          */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <AlertDialogPrimitive.Action asChild>
              <Button
                variant={destructive ? "destructive" : "pill"}
                className="h-12 w-full rounded-full sm:flex-1"
                onClick={() => onResolve(true)}
              >
                {confirmLabel}
              </Button>
            </AlertDialogPrimitive.Action>

            <AlertDialogPrimitive.Cancel asChild>
              <Button
                variant={destructive ? "pill" : "outline"}
                className={cn(
                  "h-12 w-full sm:flex-1",
                  !destructive && "rounded-full border-ink/20"
                )}
                onClick={() => onResolve(false)}
              >
                {cancelLabel}
              </Button>
            </AlertDialogPrimitive.Cancel>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
