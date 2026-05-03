import type { CatalogProduct } from "@/features/products/types"

export type ShopFilterId = (typeof SHOP_FILTER_OPTIONS)[number]["id"]

export type ShopProduct = CatalogProduct

export const SHOP_FILTER_OPTIONS = [
  { id: "all", label: "Browse all" },
  { id: "new-arrivals", label: "New arrivals" },
  { id: "dresses", label: "Dresses" },
  { id: "workwear", label: "Workwear" },
  { id: "weddings", label: "Weddings" },
  { id: "designers", label: "Designers" },
  { id: "maternity", label: "Maternity" },
  { id: "buy", label: "Buy" },
] as const

const VALID_IDS = new Set<string>(SHOP_FILTER_OPTIONS.map((o) => o.id))

export function parseShopFilter(raw: string | null): ShopFilterId {
  if (raw && VALID_IDS.has(raw)) {
    return raw as ShopFilterId
  }
  return "all"
}

export function filterShopProducts(
  products: ShopProduct[],
  filterId: ShopFilterId,
): ShopProduct[] {
  if (filterId === "all") return products
  return products.filter((p) => p.shopTags.includes(filterId))
}

export function labelForShopFilter(filterId: ShopFilterId): string {
  return SHOP_FILTER_OPTIONS.find((o) => o.id === filterId)?.label ?? "Shop"
}
