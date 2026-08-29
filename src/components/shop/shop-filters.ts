import { COLLECTIONS, OCCASIONS } from "@/config/brand"
import type { CatalogProduct } from "@/features/products/types"

export type ShopProduct = CatalogProduct

/**
 * Shop filters are derived from the collections a real Sselair customer would
 * recognise, plus two availability-driven ones. Deriving them (instead of
 * re-listing them) keeps the header, the shop page and the home rail in sync.
 */
export const SHOP_FILTER_OPTIONS = [
  { id: "all", label: "All Pieces" },
  ...COLLECTIONS.map((c) => ({ id: c.id, label: c.label })),
  { id: "new", label: "New Arrivals" },
  { id: "available", label: "Available Now" },
] as const

export type ShopFilterId = (typeof SHOP_FILTER_OPTIONS)[number]["id"]

const VALID_IDS = new Set<string>(SHOP_FILTER_OPTIONS.map((o) => o.id))

/**
 * Catalog tags are authored by merchandisers and vary in spelling, so each
 * filter accepts a set of synonyms rather than one exact tag.
 */
const FILTER_TAGS: Record<string, readonly string[]> = Object.fromEntries(
  COLLECTIONS.map((c) => [c.id, c.tags])
)

/** Occasion tags, matched from `?occasion=` rather than `?filter=`. */
const OCCASION_TAGS: Record<string, readonly string[]> = Object.fromEntries(
  OCCASIONS.map((o) => [o.id, o.tags])
)

export type OccasionFilterId = (typeof OCCASIONS)[number]["id"]

/** Old URLs, bookmarks and seeded tags → canonical filter id. */
const LEGACY_FILTER_ALIASES: Record<string, ShopFilterId> = {
  "new-arrivals": "new",
  dresses: "modern-filipiniana",
  formal: "classic-filipiniana",
  gowns: "classic-filipiniana",
  long: "classic-filipiniana",
  short: "modern-filipiniana",
  bodycon: "modern-filipiniana",
  flowy: "modern-filipiniana",
  men: "barong",
  mens: "barong",
  designers: "classic-filipiniana",
  workwear: "modern-filipiniana",
  buy: "available",
  weddings: "all",
  wedding: "all",
}

function tagsOf(p: ShopProduct): Set<string> {
  return new Set(p.shopTags.map((t) => t.toLowerCase()))
}

function hasAvailableSize(p: ShopProduct): boolean {
  if (p.sizes.length === 0) return true
  return p.sizes.some((s) => s.available)
}

export function productMatchesShopFilter(
  p: ShopProduct,
  filterId: ShopFilterId
): boolean {
  if (filterId === "all") return true

  const t = tagsOf(p)

  if (filterId === "available") return hasAvailableSize(p)
  if (filterId === "new") return t.has("new-arrivals") || t.has("new")

  const accepted = FILTER_TAGS[filterId] ?? [filterId]
  return accepted.some((tag) => t.has(tag))
}

export function productMatchesOccasion(
  p: ShopProduct,
  occasionId: OccasionFilterId
): boolean {
  const t = tagsOf(p)
  const accepted = OCCASION_TAGS[occasionId] ?? [occasionId]
  return accepted.some((tag) => t.has(tag))
}

export function parseShopFilter(raw: string | null): ShopFilterId {
  if (!raw) return "all"
  if (VALID_IDS.has(raw)) return raw as ShopFilterId
  return LEGACY_FILTER_ALIASES[raw] ?? "all"
}

export function parseOccasion(raw: string | null): OccasionFilterId | null {
  if (!raw) return null
  return raw in OCCASION_TAGS ? (raw as OccasionFilterId) : null
}

export function filterShopProducts(
  products: ShopProduct[],
  filterId: ShopFilterId,
  occasionId?: OccasionFilterId | null
): ShopProduct[] {
  let out = products
  if (filterId !== "all") {
    out = out.filter((p) => productMatchesShopFilter(p, filterId))
  }
  if (occasionId) {
    out = out.filter((p) => productMatchesOccasion(p, occasionId))
  }
  return out
}

export function labelForShopFilter(filterId: ShopFilterId): string {
  return SHOP_FILTER_OPTIONS.find((o) => o.id === filterId)?.label ?? "Shop"
}

export function labelForOccasion(id: OccasionFilterId): string {
  return OCCASIONS.find((o) => o.id === id)?.label ?? "Occasion"
}

export function shopFilterHref(id: ShopFilterId): string {
  return id === "all" ? "/shop" : `/shop?filter=${id}`
}
