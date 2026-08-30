import { useDeferredValue, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useSearchParams } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import {
  filterShopProducts,
  labelForOccasion,
  labelForShopFilter,
  parseOccasion,
  parseShopFilter,
  SHOP_FILTER_OPTIONS,
  shopFilterHref,
} from "@/components/shop/shop-filters"
import { ShopFilterBar } from "@/components/shop/ShopFilterBar"
import {
  applyRefinements,
  availableSizes,
  countActiveRefinements,
  parseRefinements,
  priceBounds,
  REFINEMENT_KEYS,
  type ShopRefinements,
} from "@/components/shop/shop-refinements"
import { EmptyState } from "@/components/ui/empty-state"
import { buildTitle } from "@/config/site"
import { COLLECTIONS } from "@/config/brand"
import { useCatalogProducts } from "@/features/products/queries"
import { cn } from "@/lib/utils"
export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeFilter = parseShopFilter(searchParams.get("filter"))
  const occasion = parseOccasion(searchParams.get("occasion"))
  const refinements = parseRefinements(searchParams)

  const { data: products = [], isPending, isError } = useCatalogProducts()

  /* Filtering is cheap but the grid re-render is not; defer it so the pill row
     stays responsive while a large catalog re-lays out. */
  const deferredFilter = useDeferredValue(activeFilter)
  const deferredOccasion = useDeferredValue(occasion)
  const deferredRefinements = useDeferredValue(refinements)

  /* Collection and occasion first, then price/size/sort on what survives. The
     order matters for the facet options below: sizes and price bounds are drawn
     from the collection in view, so "Barong Tagalog" never offers a size only a
     gown comes in. */
  const inCollection = useMemo(
    () => filterShopProducts(products, deferredFilter, deferredOccasion),
    [products, deferredFilter, deferredOccasion]
  )
  const visible = useMemo(
    () => applyRefinements(inCollection, deferredRefinements),
    [inCollection, deferredRefinements]
  )

  const sizes = useMemo(() => availableSizes(inCollection), [inCollection])
  const bounds = useMemo(() => priceBounds(inCollection), [inCollection])
  const activeRefinementCount = countActiveRefinements(refinements)

  /**
   * Write refinements back to the URL, leaving `filter` and `occasion` alone.
   *
   * `replace` so a run of adjustments does not bury the page someone arrived
   * from under a dozen history entries — the back button should leave the shop,
   * not undo filters one at a time.
   */
  const updateRefinements = (next: Partial<ShopRefinements>) => {
    const merged = { ...refinements, ...next }
    const params = new URLSearchParams(searchParams)

    const write = (key: string, value: string | null) => {
      if (value === null || value === "") params.delete(key)
      else params.set(key, value)
    }

    write(
      REFINEMENT_KEYS.min,
      merged.minPrice === null ? null : String(merged.minPrice)
    )
    write(
      REFINEMENT_KEYS.max,
      merged.maxPrice === null ? null : String(merged.maxPrice)
    )
    write(REFINEMENT_KEYS.sizes, merged.sizes.join(","))
    write(REFINEMENT_KEYS.stock, merged.inStockOnly ? "1" : null)
    write(
      REFINEMENT_KEYS.sort,
      merged.sort === "featured" ? null : merged.sort
    )

    setSearchParams(params, { replace: true })
  }

  const clearRefinements = () => {
    const params = new URLSearchParams(searchParams)
    for (const key of Object.values(REFINEMENT_KEYS)) params.delete(key)
    setSearchParams(params, { replace: true })
  }

  const filterLabel = labelForShopFilter(activeFilter)
  const collectionBlurb = COLLECTIONS.find((c) => c.id === activeFilter)?.blurb

  const heading = occasion
    ? `Filipiniana for a ${labelForOccasion(occasion).toLowerCase()}`
    : activeFilter === "all"
      ? "Every piece we rent"
      : filterLabel

  const pageTitle = buildTitle(
    occasion ? `${labelForOccasion(occasion)} · Shop` : heading
  )

  return (
    <main className="bg-paper">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <header className="border-b border-line px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="eyebrow">Shop</p>{" "}
          <h1 className="mt-3 font-heading text-3xl font-medium text-ink sm:text-4xl">
            {heading}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-base text-ink-soft">
            {collectionBlurb ??
              "Reserve by the date, fitted before you wear it, cleaning handled on our side."}
          </p>
        </div>
        <nav
          aria-label="Collections"
          className="mx-auto mt-8 no-scrollbar flex w-full gap-2 overflow-x-auto pb-1 sm:justify-center"
        >
          {SHOP_FILTER_OPTIONS.map(({ id, label }) => {
            const active = activeFilter === id && !occasion
            return (
              <Link
                key={id}
                to={shopFilterHref(id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-9 shrink-0 items-center rounded-full border px-4 text-base transition-colors",
                  active
                    ? "border-brand text-brand"
                    : "border-black text-ink hover:border-ink/30"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-5">
          <ShopFilterBar
            refinements={refinements}
            onChange={updateRefinements}
            onClear={clearRefinements}
            sizes={sizes}
            bounds={bounds}
            resultCount={visible.length}
          />
        </div>
      </header>

      <section
        className="px-4 py-10 sm:px-6 lg:px-8"
        aria-live="polite"
        aria-busy={isPending}
      >
        {isError ? (
          <p className="text-center text-base text-ink-soft">
            We could not load the collection just now. Please refresh, or
            message us and we will help you book directly.
          </p>
        ) : isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 animate-pulse rounded-sm bg-pink-light"
              />
            ))}
          </div>
        ) : (
          <div>
            <p className="mb-6 text-base text-ink-soft">
              {visible.length} {visible.length === 1 ? "piece" : "pieces"}
              {occasion
                ? ` for a ${labelForOccasion(occasion).toLowerCase()}`
                : null}
            </p>

            {visible.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {visible.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : activeRefinementCount > 0 ? (
              /*
               * Refinements emptied it, not the catalogue. Saying "this
               * collection has not been filled in yet" here would be a lie
               * about the shop and would send someone away from pieces that are
               * one relaxed filter from view — so the way out is to clear them,
               * not to leave.
               */
              <EmptyState
                art="rack"
                title="No pieces match these filters"
                description="Try a wider price range, another size, or clear the filters to see the whole collection."
                action={
                  <button
                    type="button"
                    onClick={clearRefinements}
                    className="inline-flex min-h-11 cursor-pointer items-center text-base font-medium text-brand underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <EmptyState
                art="rack"
                title="Nothing here yet"
                description="This collection has not been filled in yet. Browse everything we rent, or message us with your occasion and date."
                action={
                  <Link
                    to="/shop"
                    className="inline-flex min-h-11 items-center text-base font-medium text-brand underline underline-offset-4"
                  >
                    Browse all pieces
                  </Link>
                }
              />
            )}
          </div>
        )}
      </section>
    </main>
  )
}
