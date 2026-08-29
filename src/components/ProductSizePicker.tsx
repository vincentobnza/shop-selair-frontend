import { useState } from "react"
import { DressSizeGuideModal } from "@/components/DressSizeGuideModal"
import { cn } from "@/lib/utils"
export type ProductSizeOption = { label: string; available: boolean }

type ProductSizePickerProps = {
  sizes: ProductSizeOption[]
  value: string | null
  onChange: (label: string) => void
  /** Nudge the label when the shopper has tried to act without choosing. */
  hint?: boolean
}

/**
 * Size chips in the reference house style: a label line that doubles as the
 * prompt, a row of square chips, and a size-guide link underneath.
 * Unavailable sizes stay visible but are struck through and non-interactive,
 * so a shopper can see the range that exists before it sold out.
 */
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
      <p className="text-base text-ink">
        <span className="font-semibold">Size:</span>{" "}
        <span className={cn(hint ? "text-brand" : "text-ink-soft")}>
          {value ?? "Please select a size"}
        </span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Size">
        {sizes.map((opt) => {
          const selected = value === opt.label
          const disabled = !opt.available

          return (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(opt.label)}
              className={cn(
                "relative min-h-11 min-w-11 touch-manipulation rounded-sm border px-3 text-base transition-colors",
                disabled && "cursor-not-allowed border-line text-ink-soft/50",
                !disabled &&
                  !selected &&
                  "cursor-pointer border-line text-ink hover:border-ink/40",
                !disabled &&
                  selected &&
                  "cursor-pointer border-brand bg-brand text-white"
              )}
            >
              <span className="relative z-10">{opt.label}</span>
              {disabled ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-1 z-20 overflow-hidden"
                >
                  <span className="absolute top-1/2 left-1/2 h-px w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-32 bg-line" />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        className="mt-3 cursor-pointer touch-manipulation text-base font-medium text-brand underline underline-offset-4"
      >
        Size Guide
      </button>
      <DressSizeGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  )
}
