import { StarIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  /** Rating value 0–5 (supports halves visually via rounding to nearest). */
  value: number
  /** Pixel size of each star. */
  size?: number
  className?: string
  /** When set, renders interactive buttons that call onChange with 1–5. */
  onChange?: (value: number) => void
  ariaLabel?: string
}

/**
 * Read-only or interactive 5-star rating. Uses the storefront's amber accent
 * for filled stars and zinc for empty, matching the neutral design system.
 */
export function StarRating({
  value,
  size = 16,
  className,
  onChange,
  ariaLabel,
}: StarRatingProps) {
  const rounded = Math.round(value)
  const stars = [1, 2, 3, 4, 5]

  if (onChange) {
    return (
      <div
        className={cn("inline-flex items-center gap-1", className)}
        role="radiogroup"
        aria-label={ariaLabel ?? "Rating"}
      >
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === rounded}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            className="cursor-pointer rounded-sm p-0.5 transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <StarIcon
              size={size + 6}
              weight={star <= value ? "fill" : "regular"}
              className={star <= value ? "text-amber-500" : "text-line"}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={ariaLabel}
    >
      {stars.map((star) => (
        <StarIcon
          key={star}
          size={size}
          weight={star <= rounded ? "fill" : "regular"}
          className={star <= rounded ? "text-amber-500" : "text-line"}
        />
      ))}
    </span>
  )
}
