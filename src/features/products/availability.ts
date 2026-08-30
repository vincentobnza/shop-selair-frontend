import type { CatalogProduct } from "./types"

/**
 * Why a piece cannot be taken right now, decided in exactly one place.
 *
 * There are two distinct ways to be unavailable and they are not the same
 * thing to a customer:
 *
 * - **`out-of-stock`** — the shop holds none. Nothing to book in any size, and
 *   no date will change that.
 * - **`fully-booked`** — the shop holds it, but every size is currently out on
 *   hire. Worth saving and coming back to.
 *
 * Telling someone "out of stock" when the piece is merely booked out loses a
 * sale, so the wording follows the reason rather than collapsing both into one
 * greyed-out tile.
 */
export type ProductAvailability = "available" | "out-of-stock" | "fully-booked"

/** Stock first: a piece the shop does not hold cannot be booked in any size. */
export function productAvailability(
  product: Pick<CatalogProduct, "stock" | "sizes">
): ProductAvailability {
  if (product.stock <= 0) return "out-of-stock"

  /*
   * No size list means one-size or unsized — stock alone decides. Only when
   * sizes are declared does "every size taken" become possible.
   */
  if (product.sizes.length > 0 && !product.sizes.some((s) => s.available)) {
    return "fully-booked"
  }

  return "available"
}

export function isProductAvailable(
  product: Pick<CatalogProduct, "stock" | "sizes">
): boolean {
  return productAvailability(product) === "available"
}

/** The label shown over an unavailable tile. Null when it can be taken. */
export function availabilityLabel(
  availability: ProductAvailability
): string | null {
  switch (availability) {
    case "out-of-stock":
      return "Out of stock"
    case "fully-booked":
      return "Fully booked"
    default:
      return null
  }
}
