import type { ApiProductRow, CatalogProduct } from "./types"

export function toCatalogProduct(row: ApiProductRow): CatalogProduct {
  return {
    id: String(row.id),
    name: row.name,
    brand: row.brand ?? "",
    image: row.images ?? [],
    price: row.price_cents / 100,
    duration: row.duration_days ?? 4,
    description: row.highlights ?? [],
    shopTags: row.shop_tags ?? [],
    sizes: row.sizes ?? [],
  }
}
