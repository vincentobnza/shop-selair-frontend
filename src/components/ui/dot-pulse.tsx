import { cn } from "@/lib/utils"

const staggerMs = [0, 140, 280] as const

export type DotPulseProps = {
  className?: string
  /** Announced to screen readers */
  label?: string
  size?: "sm" | "md" | "lg"
}

export function DotPulse({
  className,
  label = "Loading",
  size = "sm",
}: DotPulseProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-[5px] text-inherit",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {staggerMs.map((delay, i) => (
        <span
          key={i}
          className={cn("shrink-0 bg-current animate-dot-pulse", size === "sm" ? "size-1.5" : size === "md" ? "size-2" : "size-2.5")}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
