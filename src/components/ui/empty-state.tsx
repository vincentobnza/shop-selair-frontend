import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Line-art illustrations for the empty states.
 *
 * Drawn inline rather than shipped as images: they inherit `currentColor`, stay
 * crisp at any size, and cost no extra request. Keep them single-weight strokes
 * with no fills so they sit quietly inside the ring.
 */
const ART = {
  hanger: (
    <>
      <path d="M24 14a4 4 0 1 1 4 4c-2.2 0-4 1.8-4 4" />
      <path d="M24 22v3" />
      <path d="M24 25 8.6 34.2A2 2 0 0 0 9.6 38h28.8a2 2 0 0 0 1-3.8L24 25Z" />
    </>
  ),
  bag: (
    <>
      <path d="M11 17h26l-2.2 20a3 3 0 0 1-3 2.7H16.2a3 3 0 0 1-3-2.7L11 17Z" />
      <path d="M18 21v-4a6 6 0 0 1 12 0v4" />
    </>
  ),
  search: (
    <>
      <circle cx="22" cy="22" r="11" />
      <path d="m30 30 8 8" />
    </>
  ),
  parcel: (
    <>
      <path d="M24 10 9 17.5v13L24 38l15-7.5v-13L24 10Z" />
      <path d="M9 17.5 24 25l15-7.5M24 25v13" />
    </>
  ),
  star: (
    <path d="m24 11 4.2 8.5 9.4 1.4-6.8 6.6 1.6 9.3L24 32.4 15.6 36.8l1.6-9.3-6.8-6.6 9.4-1.4L24 11Z" />
  ),
  pin: (
    <>
      <path d="M24 10a10 10 0 0 1 10 10c0 7-10 18-10 18S14 27 14 20a10 10 0 0 1 10-10Z" />
      <circle cx="24" cy="20" r="3.5" />
    </>
  ),
  bell: (
    <>
      <path d="M24 11a9 9 0 0 1 9 9v7l2.5 4.5a1 1 0 0 1-.9 1.5H13.4a1 1 0 0 1-.9-1.5L15 27v-7a9 9 0 0 1 9-9Z" />
      <path d="M20.5 33a3.5 3.5 0 0 0 7 0" />
      <path d="M24 8v3" />
    </>
  ),
  rack: (
    <>
      <path d="M24 9v6" />
      <path d="M10 15h28" />
      <path d="M16 15v10a8 8 0 0 0 16 0V15" />
      <path d="M24 33v6M18 39h12" />
    </>
  ),
} as const

export type EmptyStateArt = keyof typeof ART

type EmptyStateProps = {
  /** Which line drawing to show inside the ring. */
  art?: EmptyStateArt
  title: string
  description?: ReactNode
  /** Primary follow-up — a link or button. */
  action?: ReactNode
  /** Sits beneath the action as a quieter alternative. */
  secondaryAction?: ReactNode
  className?: string
}

/**
 * The single empty state used everywhere: an outlined illustration, a headline,
 * a line of guidance, and a way forward.
 *
 * Every empty view in the app should render this rather than assembling its own
 * icon-plus-text block, so "nothing here" reads the same in the bag, the shop
 * grid, search results and every account section.
 */
export function EmptyState({
  art = "rack",
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[1.75rem] bg-pink-light px-6 py-16 text-center",
        className
      )}
    >
      <span
        aria-hidden
        className="flex size-24 items-center justify-center rounded-full border border-ink text-ink"
      >
        <svg
          viewBox="0 0 48 48"
          className="size-12"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ART[art]}
        </svg>
      </span>

      <p className="mt-6 font-heading text-2xl font-medium text-ink">{title}</p>

      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-7">{action}</div> : null}
      {secondaryAction ? <div className="mt-3">{secondaryAction}</div> : null}
    </div>
  )
}
