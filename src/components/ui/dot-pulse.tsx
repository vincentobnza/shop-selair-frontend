import { cn } from "@/lib/utils"

const staggerMs = [0, 140, 280] as const

export type DotPulseProps = {
  className?: string
  /** Announced to screen readers */
  label?: string
}

export function DotPulse({
  className,
  label = "Loading",
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
          className="size-1.5 shrink-0 rounded-full bg-current animate-dot-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
