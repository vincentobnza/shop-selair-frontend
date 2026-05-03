import { useState } from "react"

import { DressSizeGuideModal } from "@/components/DressSizeGuideModal"
import { cn } from "@/lib/utils"

export type ProductSizeOption = { label: string; available: boolean }

type ProductSizePickerProps = {
  sizes: ProductSizeOption[]
  value: string | null
  onChange: (label: string) => void
  hint?: boolean
}

export function ProductSizePicker({
  sizes,
  value,
  onChange,
  hint,
}: ProductSizePickerProps) {
  const [guideOpen, setGuideOpen] = useState(false)

  if (sizes.length === 0) return null

  return (
    <div className="mt-6">
      <p className="text-sm text-zinc-900">
        <span className="font-medium">Size:</span>{" "}
        <span
          className={cn(
            "font-medium",
            hint ? "text-amber-900" : "text-zinc-600",
          )}
        >
          {hint ? "Choose a size" : (value ?? "—")}
        </span>
      </p>

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="group"
        aria-label="Size"
      >
        {sizes.map((opt) => {
          const selected = value === opt.label
          const disabled = !opt.available

          return (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.label)}
              className={cn(
                "relative min-h-11 min-w-11 touch-manipulation rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                disabled &&
                  "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400",
                !disabled &&
                  !selected &&
                  "border-zinc-900 text-zinc-900 hover:bg-zinc-50",
                !disabled &&
                  selected &&
                  "border-zinc-900 bg-zinc-900 text-white",
              )}
            >
              <span
                className={cn("relative z-10", disabled && "text-zinc-400")}
              >
                {opt.label}
              </span>
              {disabled ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-1 z-20 overflow-hidden rounded"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-[160%] -translate-x-1/2 -translate-y-1/2 rotate-[-32deg] bg-zinc-400" />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        className="mt-3 text-sm font-bold text-zinc-900 underline underline-offset-4 touch-manipulation"
      >
        Size Guide
      </button>

      <DressSizeGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  )
}
