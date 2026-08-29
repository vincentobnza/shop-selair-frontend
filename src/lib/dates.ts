/**
 * One date voice for the storefront: "Aug 31, 2026".
 *
 * Everything a shopper reads goes through here, so a rental window, an order
 * date and a cart line all say the day the same way.
 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Parse an API date.
 *
 * A bare `2026-08-31` is parsed by the platform as UTC midnight, which renders
 * as the *previous* day for any viewer west of Greenwich — a rental booked for
 * the 31st would read "Aug 30" in New York. Calendar dates are days, not
 * instants, so they are built at local midnight instead. Full timestamps, which
 * really are instants, keep their normal parsing.
 */
function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null

  const date = DATE_ONLY.test(value)
    ? new Date(
        Number(value.slice(0, 4)),
        Number(value.slice(5, 7)) - 1,
        Number(value.slice(8, 10))
      )
    : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

/** "Aug 31, 2026" — the storefront's date format. Em dash when there is none. */
export function formatDate(value: string | null | undefined): string {
  const date = parseApiDate(value)
  if (!date) return "—"
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
