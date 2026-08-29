import { useDeferredValue, useMemo, useState, useTransition } from "react"
import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import {
  filterShopProducts,
  shopFilterHref,
  type ShopFilterId,
} from "@/components/shop/shop-filters"
import { COLLECTIONS } from "@/config/brand"
import { useCatalogProducts } from "@/features/products/queries"
import { cn } from "@/lib/utils"

type RailFilter = { id: ShopFilterId; label: string }

const RAIL_FILTERS: RailFilter[] = [
  { id: "new", label: "New Arrivals" },
  ...COLLECTIONS.map((c) => ({ id: c.id as ShopFilterId, label: c.label })),
]

const SKELETON_COUNT = 6

/**
 * Merchandised rail: a pill filter row over a horizontally scrolling set of
 * product cards — the "Statement Makers" module from the reference home page.
 *
 * Filtering happens on the already-fetched catalog, so switching pills costs no
 * network round-trip. The heavy re-render is marked non-urgent with
 * `useTransition` and read through `useDeferredValue`, which keeps the pills
 * responsive to taps on mid-range phones.
 */
export function CollectionRail() {
  const { data: items = [], isPending, isError } = useCatalogProducts()
  const [active, setActive] = useState<ShopFilterId>("new")
  const [, startTransition] = useTransition()
  const deferredActive = useDeferredValue(active)

  const visible = useMemo(() => {
    const matched = filterShopProducts(items, deferredActive)
    /* A merchandising rail should never render empty just because a collection
       has not been tagged yet — fall back to the full catalog. */
    return matched.length > 0 ? matched : items
  }, [items, deferredActive])

  return (
    <section id="collections" className="bg-paper">
      <div className="py-12 sm:py-16">
        <header className="px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-medium text-ink sm:text-3xl">
            Statement pieces
          </h2>
          <p className="mt-2 text-base text-ink-soft">
            The Filipiniana people book first — and the pieces that finish them.
          </p>
        </header>
        <div className="mt-6 no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 pb-1 sm:justify-center sm:px-6 lg:px-8">
          {RAIL_FILTERS.map((f) => {
            const isActive = active === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => startTransition(() => setActive(f.id))}
                className={cn(
                  "min-h-9 shrink-0 cursor-pointer rounded-full border px-4 text-base transition-colors",
                  isActive
                    ? "border-brand text-brand"
                    : "border-line text-ink hover:border-ink/30"
                )}
              >
                {f.label}
              </button>
            )
          })}
        </div>
        <div className="mt-6" aria-live="polite">
          {isError ? (
            <p className="px-4 text-center text-base text-ink-soft">
              We could not load the collection just now. Please try again.
            </p>
          ) : isPending ? (
            <div className="flex gap-3 overflow-hidden px-4 sm:px-6 lg:px-8">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 w-[74%] shrink-0 animate-pulse rounded-sm bg-pink-light sm:w-[38%] lg:w-[23%]"
                />
              ))}
            </div>
          ) : (
            <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
              {visible.map((item) => (
                <li
                  key={item.id}
                  className="w-[74%] shrink-0 snap-start sm:w-[38%] lg:w-[24%] xl:w-[20%]"
                >
                  <ProductCard product={item} compact />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link
            to={shopFilterHref(active)}
            className="text-base font-medium text-brand underline-offset-4 hover:underline"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CollectionRail
