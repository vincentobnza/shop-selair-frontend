import { Helmet } from "react-helmet-async"
import { Link, useSearchParams } from "react-router-dom"

import {
  filterShopProducts,
  labelForShopFilter,
  parseShopFilter,
  SHOP_FILTER_OPTIONS,
  shopFilterHref,
} from "@/components/shop/shop-filters"
import { ProductCard } from "@/components/ProductCard"
import { buildTitle } from "@/config/site"
import { useCatalogProducts } from "@/features/products/queries"
import { cn } from "@/lib/utils"

export function ShopPage() {
  const [searchParams] = useSearchParams()
  const activeFilter = parseShopFilter(searchParams.get("filter"))
  const { data: products = [], isPending, isError } = useCatalogProducts()
  const visible = filterShopProducts(products, activeFilter)
  const filterLabel = labelForShopFilter(activeFilter)
  const pageTitle = buildTitle(
    activeFilter === "all"
      ? "Shop essentials with ease"
      : `${filterLabel} · Shop`,
  )

  return (
    <main className="bg-white">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="px-1 py-10 sm:py-12 lg:py-14">
        <header className="px-4 sm:px-6 lg:px-8 border-b border-neutral-200 py-12 sm:py-16">
          <h1 className="font-heading text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
            Shop essentials with ease
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            Practical checkout and delivery—browse by category below.
          </p>

          <nav
            aria-label="Shop categories"
            className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SHOP_FILTER_OPTIONS.map(({ id, label }) => {
              const active = activeFilter === id
              return (
                <Link
                  key={id}
                  to={shopFilterHref(id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
                    active
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-neutral-200 bg-white text-zinc-800 hover:border-zinc-400",
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </header>

        <section className="pt-10" aria-live="polite">
          {isError ? (
            <p className="text-sm text-red-700">
              Could not load the catalog. Ensure the API is running and try again.
            </p>
          ) : isPending ? (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-sm bg-zinc-100"
                />
              ))}
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-zinc-500">
                {visible.length}{" "}
                {visible.length === 1 ? "piece" : "pieces"}
                {activeFilter !== "all" ? (
                  <>
                    {" "}
                    in <span className="font-medium text-zinc-800">{filterLabel}</span>
                  </>
                ) : null}
              </p>

              {visible.length > 0 ? (
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-neutral-200 bg-zinc-50 px-6 py-14 text-center">
                  <p className="font-heading text-base text-zinc-800">
                    Nothing here yet
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Try another category or browse the full catalog.
                  </p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4"
                  >
                    Browse all
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
