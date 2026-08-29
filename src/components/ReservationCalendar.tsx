import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { AnimatePresence, motion } from "motion/react"
import { CalendarDotsIcon } from "@phosphor-icons/react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useProductAvailability } from "@/features/reservations/queries"

type ReservationCalendarProps = {
  range: DateRange | undefined
  setRange: (range: DateRange | undefined) => void
  productId?: string | number
}

/**
 * Rental date picker.
 *
 * The calendar opens in a bottom sheet rather than a popover: on a phone a
 * two-month range picker never fits beside its trigger, and a sheet gives the
 * same affordance on every breakpoint. Escape and the overlay dismiss it, and
 * the page behind is locked while it is up.
 */
export function ReservationCalendar({
  range,
  setRange,
  productId,
}: ReservationCalendarProps) {
  const [open, setOpen] = useState(false)
  /* Two months side by side only fit from the `sm` breakpoint up. */
  const wide = useMediaQuery("(min-width: 40rem)")

  const { data: availability } = useProductAvailability(
    productId ? String(productId) : undefined
  )

  const disabled = useMemo(() => {
    /* Yesterday and earlier can never be booked. */
    const ranges: Array<{ from: Date; to: Date } | { before: Date }> = [
      { before: new Date(new Date().setHours(0, 0, 0, 0)) },
    ]

    for (const r of availability?.blocked ?? []) {
      ranges.push({
        from: new Date(`${r.from}T00:00:00`),
        to: new Date(`${r.to}T00:00:00`),
      })
    }

    return ranges
  }, [availability])

  const now = new Date()
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endMonth = new Date(now.getFullYear() + 2, 11, 1)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const label = (() => {
    if (range?.from && range?.to) {
      return `${format(range.from, "d MMM yyyy")} — ${format(range.to, "d MMM yyyy")}`
    }
    if (range?.from) {
      return `${format(range.from, "d MMM yyyy")} — select a return date`
    }
    return "Select rental dates"
  })()

  const complete = Boolean(range?.from && range?.to)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        data-empty={!range?.from}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="h-12! w-full justify-between rounded-sm! border-line text-left text-base font-medium data-[empty=true]:text-ink-soft"
      >
        <span className="truncate">{label}</span>
        <CalendarDotsIcon data-icon="inline-end" />
      </Button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close date picker"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-99 bg-black/50"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Select rental dates"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 z-99 flex max-h-[90svh] flex-col rounded-t-[1.75rem] bg-white sm:mx-auto sm:max-w-3xl"
            >
              {/* Grab handle — the usual affordance for a sheet. */}
              <span
                aria-hidden
                className="mx-auto mt-3 block h-1 w-12 shrink-0 rounded-full bg-pink"
              />

              <header className="shrink-0 px-5 pt-4 text-center">
                <h2 className="font-heading text-2xl font-medium text-ink">
                  Select your dates
                </h2>
                <p className="mt-1 text-base text-ink-soft">
                  {complete
                    ? label
                    : "Pick the day it should arrive, then the day it goes back."}
                </p>
              </header>

              {/* Only the calendar scrolls, so the actions below stay put. */}
              {/*
                One calendar, not two hidden behind breakpoints: a second
                mounted copy keeps its own displayed month and its own
                selection highlights, which is what made a range spanning two
                months look duplicated.
              */}
              <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-5 pt-4">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  defaultMonth={range?.from}
                  numberOfMonths={wide ? 2 : 1}
                  showOutsideDays={false}
                  captionLayout="dropdown"
                  startMonth={startMonth}
                  endMonth={endMonth}
                  disabled={disabled}
                />
              </div>

              <div
                className="shrink-0 bg-white px-5 pt-4 pb-6"
                style={{
                  paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
                }}
              >
                <div className="flex flex-col gap-2 sm:flex-row-reverse">
                  <Button
                    type="button"
                    variant="pill"
                    disabled={!complete}
                    onClick={() => setOpen(false)}
                    className="h-12 w-full shrink-0 text-base font-semibold sm:w-auto sm:flex-1"
                  >
                    {complete ? "Use these dates" : "Pick a return date"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRange(undefined)}
                    className="h-12 w-full shrink-0 rounded-full border-line text-base sm:w-auto sm:flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
