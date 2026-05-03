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
}

/** Normalized for UI (cards, filters, cart guest lines). */
export type CatalogProduct = {
  id: string
  name: string
  brand: string
  image: string[]
  price: number
  duration: number
  description: string[]
  shopTags: string[]
  sizes: { label: string; available: boolean }[]
}
