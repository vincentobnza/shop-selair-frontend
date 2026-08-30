import { isProductAvailable } from "@/features/products/availability"
import type { CatalogProduct } from "@/features/products/types"

/**
 * Price, size, availability and sort — the refinements that sit on top of the
 * collection pills.
 *
 * Pure functions over an already-fetched catalogue, deliberately. The whole
 * catalogue is loaded once for the grid, so filtering it here is a pass over an
 * array in memory; pushing these to the API would add a round trip per
 * keystroke and a loading state to something that should feel instant. Revisit
 * that when the catalogue is large enough that shipping it all is the problem.
 *
 * Everything lives in the URL. A filtered shop is something people paste to a
 * friend and reach for the back button out of, and neither survives component
 * state.
 */

export type SortId = "featured" | "price-asc" | "price-desc" | "rating"

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
]

const SORT_IDS = new Set<string>(SORT_OPTIONS.map((o) => o.id))

export type ShopRefinements = {
  /** Pesos, inclusive. Null means open-ended on that side. */
  minPrice: number | null
  maxPrice: number | null
  /** Size labels the piece must offer. Empty means any. */
  sizes: string[]
  /** Hide anything out of stock or fully booked. */
  inStockOnly: boolean
  sort: SortId
}

export const EMPTY_REFINEMENTS: ShopRefinements = {
  minPrice: null,
  maxPrice: null,
  sizes: [],
  inStockOnly: false,
  sort: "featured",
}

/** Query-string keys, named once so the parser and the writer cannot disagree. */
export const REFINEMENT_KEYS = {
  min: "min",
  max: "max",
  sizes: "sizes",
  stock: "stock",
  sort: "sort",
} as const

function parsePrice(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null
  const value = Number(raw)
  /* A negative or non-numeric bound is a broken URL, not a filter. Dropping it
     shows everything, which is recoverable; treating NaN as a bound silently
     empties the grid and looks like the shop has nothing in it. */
  if (!Number.isFinite(value) || value < 0) return null
  return value
}

export function parseRefinements(params: URLSearchParams): ShopRefinements {
  const min = parsePrice(params.get(REFINEMENT_KEYS.min))
  const max = parsePrice(params.get(REFINEMENT_KEYS.max))

  const sizes = (params.get(REFINEMENT_KEYS.sizes) ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  const sortRaw = params.get(REFINEMENT_KEYS.sort) ?? ""
  const sort = SORT_IDS.has(sortRaw) ? (sortRaw as SortId) : "featured"

  return {
    /* A reversed range (min above max) matches nothing and reads as a bug. The
       two are swapped rather than honoured, which is what someone who typed
       them the wrong way round meant. */
    minPrice: min !== null && max !== null && min > max ? max : min,
    maxPrice: min !== null && max !== null && min > max ? min : max,
    sizes,
    inStockOnly: params.get(REFINEMENT_KEYS.stock) === "1",
    sort,
  }
}

/** How many refinements are active — drives the "N" badge and "Clear all". */
export function countActiveRefinements(r: ShopRefinements): number {
  let n = 0
  if (r.minPrice !== null || r.maxPrice !== null) n += 1
  if (r.sizes.length > 0) n += 1
  if (r.inStockOnly) n += 1
  // Sort is not a filter: it changes the order, never the set.
  return n
}

function offersSize(product: CatalogProduct, wanted: string[]): boolean {
  if (wanted.length === 0) return true
  return product.sizes.some(
    (s) => wanted.includes(s.label.trim().toUpperCase()) && s.available
  )
}

/**
 * Apply the refinements, then order the result.
 *
 * Sorting is done on a copy: the array handed in is React Query's cached data,
 * and sorting it in place would mutate the cache and reorder every other view
 * reading the same query.
 */
export function applyRefinements(
  products: CatalogProduct[],
  r: ShopRefinements
): CatalogProduct[] {
  const filtered = products.filter((p) => {
    if (r.minPrice !== null && p.price < r.minPrice) return false
    if (r.maxPrice !== null && p.price > r.maxPrice) return false
    if (r.inStockOnly && !isProductAvailable(p)) return false
    if (!offersSize(p, r.sizes)) return false
    return true
  })

  switch (r.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price)
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price)
    case "rating":
      /* Rating first, then how many people gave it: a lone five-star review is
         weaker evidence than twenty averaging 4.6, and ordering on the average
         alone puts the former above the latter. */
      return [...filtered].sort(
        (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount
      )
    default:
      return filtered
  }
}

/** Every size label the catalogue offers, in the shop's own order. */
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"]

export function availableSizes(products: CatalogProduct[]): string[] {
  const seen = new Set<string>()
  for (const p of products) {
    for (const s of p.sizes) seen.add(s.label.trim().toUpperCase())
  }
  return [...seen].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a)
    const ib = SIZE_ORDER.indexOf(b)
    // Anything the shop invents later sorts alphabetically after the known run.
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

/** The catalogue's own price bounds, for the input placeholders. */
export function priceBounds(products: CatalogProduct[]): {
  min: number
  max: number
} {
  if (products.length === 0) return { min: 0, max: 0 }
  let min = Infinity
  let max = 0
  for (const p of products) {
    if (p.price < min) min = p.price
    if (p.price > max) max = p.price
  }
  return { min: Math.floor(min), max: Math.ceil(max) }
}
