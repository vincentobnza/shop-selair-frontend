import type { ApiProductRow, CatalogProduct } from "./types"
import { fileUrl } from "@/lib/api-base"

/**
 * The collection whose pieces are sold rather than hired.
 *
 * Kept as a constant next to the mapping it drives: if the shop ever sells a
 * second category outright, this becomes a list and nothing else changes.
 */
export const PURCHASE_ONLY_COLLECTION = "accessories"

export function slugifyProductName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function toCatalogProduct(row: ApiProductRow): CatalogProduct {
  return {
    id: String(row.id),
    name: row.name,
    brand: row.brand ?? "",
    image: (row.images ?? []).map(fileUrl),
    price: row.price_cents / 100,
    duration: row.duration_days ?? 4,
    description: row.highlights ?? [],
    descriptionHtml: row.description,
    purchaseOnly: (row.shop_tags ?? []).includes(PURCHASE_ONLY_COLLECTION),
    shopTags: row.shop_tags ?? [],
    sizes: row.sizes ?? [],
    ratingAvg: row.rating_avg ?? 0,
    ratingCount: row.rating_count ?? 0,
  }
}
