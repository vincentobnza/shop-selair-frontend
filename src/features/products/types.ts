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
  shopTags: string[]
  sizes: { label: string; available: boolean }[]
  ratingAvg: number
  ratingCount: number
}
