import { useCallback, useEffect, useState } from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

/**
 * Slim announcement bar that rotates through a small set of messages, matching
 * the reference layout: centred bold copy, an inline link, and chevrons at the
 * far edges.
 *
 * Rotation pauses on hover/focus and is disabled entirely for users who ask for
 * reduced motion — the chevrons remain, so the content is always reachable.
 */
const PROMOS = [
  {
    text: "Reserve your Filipiniana for the whole event week",
    cta: { label: "Browse pieces", to: "/shop" },
  },
  {
    text: "Barong, terno & kids' formal — fitted before you wear it",
    cta: { label: "Book a fitting", to: "/#fittings" },
  },
  {
    text: "Pearls, brooches & boleros to finish the look",
    cta: { label: "Shop accessories", to: "/shop?filter=accessories" },
  },
] as const

const ROTATE_MS = 7000

export function PromoBanner() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + PROMOS.length) % PROMOS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const id = window.setInterval(() => go(1), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [go, paused])

  const promo = PROMOS[index]

  return (
    <div
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative flex h-12 w-full items-center justify-center bg-brand px-10 text-white sm:px-14"
    >
      <button
        type="button"
        aria-label="Previous announcement"
        onClick={() => go(-1)}
        className="absolute left-1 flex size-10 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:text-white sm:left-3"
      >
        <CaretLeftIcon size={18} weight="bold" />
      </button>

      <p
        aria-live="polite"
        className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 text-center text-base font-semibold sm:text-base"
      >
        <span className="truncate sm:whitespace-normal">{promo.text}</span>
        <Link
          to={promo.cta.to}
          className="shrink-0 font-normal underline-offset-2 hover:underline"
        >
          {promo.cta.label}
        </Link>
      </p>

      <button
        type="button"
        aria-label="Next announcement"
        onClick={() => go(1)}
        className="absolute right-1 flex size-10 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:text-white sm:right-3"
      >
        <CaretRightIcon size={18} weight="bold" />
      </button>
    </div>
  )
}
