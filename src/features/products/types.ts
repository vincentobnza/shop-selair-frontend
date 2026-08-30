/** Laravel Product JSON (public endpoints). */
export type ApiProductRow = {
  id: number
  name: string
  sku: string
  description: string | null
  brand: string | null
  images: string[] | null
  duration_days: number
  highlights: string[] | null
  shop_tags: string[] | null
  sizes: { label: string; available: boolean }[] | null
  price_cents: number
  stock: number
  is_active: boolean
  /** Aggregate review rating (0 when no reviews). Added by the marketplace API. */
  rating_avg?: number
  rating_count?: number
}

/** Normalized for UI (cards, filters, cart guest lines). */
export type CatalogProduct = {
  id: string
  name: string
  brand: string
  image: string[]
  price: number
  duration: number
  /** Bulleted facts shown under "The details" — mapped from `highlights`. */
  description: string[]
  /** The shop's own write-up, as HTML from the admin editor. */
  descriptionHtml: string | null
  /**
   * Bought outright rather than hired — accessories.
   *
   * A brooch or a set of pearls does not come back, so it has no rental
   * window, no fitting and no return: it is simply bought. Every surface that
   * would otherwise ask for dates reads this instead of testing the tag
   * itself, so "what is rentable" is decided in exactly one place.
   */
  purchaseOnly: boolean
  shopTags: string[]
  sizes: { label: string; available: boolean }[]
  /**
   * Units the shop holds. Zero is "out of stock" and is a different state from
   * every size being booked out — see `availability.ts`, which is the only
   * place that distinction is made.
   */
  stock: number
  ratingAvg: number
  ratingCount: number
}
