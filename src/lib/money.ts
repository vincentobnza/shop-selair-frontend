/** Shared PHP currency formatting (integer-peso display, matching the storefront). */
const phpFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

/** Format a peso amount, e.g. 1299 → "₱1,299". */
export function formatPhp(pesos: number): string {
  return phpFormatter.format(pesos)
}

/** Format an integer-cents amount, e.g. 129900 → "₱1,299". */
export function formatPhpFromCents(cents: number): string {
  return phpFormatter.format(cents / 100)
}
