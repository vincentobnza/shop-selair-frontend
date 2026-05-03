import type { CatalogProduct } from "@/features/products/types"

export type ShopFilterId = (typeof SHOP_FILTER_OPTIONS)[number]["id"]

export type ShopProduct = CatalogProduct

export const SHOP_FILTER_OPTIONS = [
  { id: "all", label: "All Dresses" },

  // Occasion-based (primary driver)
  { id: "wedding", label: "Wedding" },
  { id: "formal", label: "Formal / Gala" },
  { id: "party", label: "Party" },
  { id: "casual", label: "Casual" },

  // Style
  { id: "long", label: "Long Dresses" },
  { id: "short", label: "Short Dresses" },
  { id: "bodycon", label: "Bodycon" },
  { id: "flowy", label: "Flowy" },

  // Fit / Special use
  { id: "maternity", label: "Maternity" },
  { id: "plus-size", label: "Plus Size" },

  // Business logic
  { id: "available", label: "Available Now" },
  { id: "new", label: "New Arrivals" },
] as const

const VALID_IDS = new Set<string>(SHOP_FILTER_OPTIONS.map((o) => o.id))

/** Old URLs / navbar bookmarks → canonical filter id */
const LEGACY_FILTER_ALIASES: Record<string, ShopFilterId> = {
  "new-arrivals": "new",
  weddings: "wedding",
  dresses: "all",
  designers: "formal",
  workwear: "casual",
  buy: "available",
}

function tags(p: ShopProduct): Set<string> {
  return new Set(p.shopTags)
}

function hasAvailableSize(p: ShopProduct): boolean {
  if (p.sizes.length === 0) return true
  return p.sizes.some((s) => s.available)
}

export function productMatchesShopFilter(
  p: ShopProduct,
  filterId: ShopFilterId,
): boolean {
  if (filterId === "all") return true

  const t = tags(p)

  switch (filterId) {
    case "wedding":
      return t.has("wedding") || t.has("weddings")
    case "new":
      return t.has("new-arrivals")
    case "available":
      return hasAvailableSize(p)
    default:
      return t.has(filterId)
  }
}

export function parseShopFilter(raw: string | null): ShopFilterId {
  if (!raw) return "all"
  if (VALID_IDS.has(raw)) return raw as ShopFilterId
  const mapped = LEGACY_FILTER_ALIASES[raw]
  if (mapped) return mapped
  return "all"
}

export function filterShopProducts(
  products: ShopProduct[],
  filterId: ShopFilterId,
): ShopProduct[] {
  if (filterId === "all") return products
  return products.filter((p) => productMatchesShopFilter(p, filterId))
}

export function labelForShopFilter(filterId: ShopFilterId): string {
  return SHOP_FILTER_OPTIONS.find((o) => o.id === filterId)?.label ?? "Shop"
}

export function shopFilterHref(id: ShopFilterId): string {
  return id === "all" ? "/shop" : `/shop?filter=${id}`
}
