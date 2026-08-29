import {
  useDeferredValue,
  useId,
  useMemo,
  useState,
  type FormEvent,
} from "react"
import { Helmet } from "react-helmet-async"
import { Link, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  CaretUpDownIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  RulerIcon,
} from "@phosphor-icons/react"
import { ProductCard } from "@/components/ProductCard"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { COLLECTIONS } from "@/config/brand"
import { buildTitle } from "@/config/site"
import {
  productMatchesShopFilter,
  type ShopFilterId,
} from "@/components/shop/shop-filters"
import { searchPublicProducts } from "@/features/products/api"
import { toCatalogProduct } from "@/features/products/map"
import type { CatalogProduct } from "@/features/products/types"
import { cn } from "@/lib/utils"

const SORTS = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const

type SortId = (typeof SORTS)[number]["id"]

/** Sorting is a strategy map rather than a switch, so adding one is one entry. */
const SORTERS: Record<
  SortId,
  ((a: CatalogProduct, b: CatalogProduct) => number) | null
> = {
  relevance: null, // API order is the relevance order — leave it alone.
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
}

function controlClass(active?: boolean) {
  return cn(
    "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm bg-white px-4 text-base text-ink transition-colors hover:text-brand",
    active && "text-brand"
  )
}

/** Accessible on/off control — the project has no switch primitive yet. */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 cursor-pointer items-center gap-2 rounded-sm bg-white px-4 text-base text-ink"
    >
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-line"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </span>
      {label}
    </button>
  )
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get("q")?.trim() ?? ""

  const inputId = useId()
  const [input, setInput] = useState(query)

  const [sort, setSort] = useState<SortId>("relevance")
  const [sizes, setSizes] = useState<string[]>([])
  const [collection, setCollection] = useState<ShopFilterId | null>(null)
  const [availableOnly, setAvailableOnly] = useState(false)

  /* Reset the field when the URL query changes (back/forward, header search)
     without an effect — see the same pattern in the header. */
  const [lastQuery, setLastQuery] = useState(query)
  if (query !== lastQuery) {
    setLastQuery(query)
    setInput(query)
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: async (): Promise<CatalogProduct[]> => {
      const rows = await searchPublicProducts(query, { perPage: 60 })
      return rows.map(toCatalogProduct)
    },
    enabled: query.length > 0,
  })

  const results = useMemo(() => data ?? [], [data])

  /** Size chips are built from what the result set actually contains. */
  const sizeOptions = useMemo(() => {
    const seen = new Set<string>()
    for (const p of results) {
      for (const s of p.sizes) seen.add(s.label)
    }
    return [...seen]
  }, [results])

  const refinement = useDeferredValue({
    sort,
    sizes,
    collection,
    availableOnly,
  })

  const visible = useMemo(() => {
    let out = results

    if (refinement.availableOnly) {
      out = out.filter((p) => productMatchesShopFilter(p, "available"))
    }
    if (refinement.collection) {
      out = out.filter((p) =>
        productMatchesShopFilter(p, refinement.collection as ShopFilterId)
      )
    }
    if (refinement.sizes.length > 0) {
      out = out.filter((p) =>
        p.sizes.some((s) => s.available && refinement.sizes.includes(s.label))
      )
    }

    const sorter = SORTERS[refinement.sort]
    return sorter ? [...out].sort(sorter) : out
  }, [results, refinement])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    setParams(q ? { q } : {}, { replace: false })
  }

  const activeFilterCount =
    (collection ? 1 : 0) + (availableOnly ? 1 : 0) + sizes.length
  const loading = query.length > 0 && (isLoading || isFetching)

  return (
    <main className="bg-paper">
      <Helmet>
        <title>{buildTitle(query ? `“${query}”` : "Search")}</title>{" "}
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8">
        <p className="eyebrow">Search results</p>{" "}
        <h1 className="mt-2 font-heading text-3xl font-medium text-ink sm:text-4xl">
          {query ? `“${query}”` : "Search"}
        </h1>
        {/* When there is nothing to show yet, the field is the page. */}
        {query.length === 0 ? (
          <form
            role="search"
            onSubmit={onSubmit}
            className="mx-auto mt-6 flex max-w-lg items-center gap-2 border-b border-brand"
          >
            <label htmlFor={inputId} className="sr-only">
              Search pieces
            </label>
            <MagnifyingGlassIcon
              size={20}
              aria-hidden
              className="shrink-0 text-brand"
            />
            <input
              id={inputId}
              type="search"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search Filipiniana, barong, accessories…"
              className="h-12 w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft [&::-webkit-search-cancel-button]:appearance-none"
            />
          </form>
        ) : null}
      </header>

      {query.length > 0 ? (
        <>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
              <label className={controlClass()}>
                <span className="sr-only">Sort results</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="cursor-pointer appearance-none bg-transparent pr-1 text-base text-ink outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <CaretUpDownIcon size={16} aria-hidden className="text-brand" />
              </label>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Popover>
                  <PopoverTrigger
                    className={controlClass(sizes.length > 0)}
                    disabled={sizeOptions.length === 0}
                  >
                    <RulerIcon size={18} aria-hidden />
                    Sizes
                    {sizes.length > 0 ? ` (${sizes.length})` : ""}
                  </PopoverTrigger>
                  <PopoverContent align="center">
                    <p className="eyebrow px-1">Available sizes</p>{" "}
                    <div className="flex flex-wrap gap-2 px-1 pb-1">
                      {sizeOptions.map((size) => {
                        const on = sizes.includes(size)
                        return (
                          <button
                            key={size}
                            type="button"
                            aria-pressed={on}
                            onClick={() =>
                              setSizes((prev) =>
                                on
                                  ? prev.filter((s) => s !== size)
                                  : [...prev, size]
                              )
                            }
                            className={cn(
                              "min-h-11 min-w-11 cursor-pointer rounded-sm border px-3 text-base transition-colors",
                              on
                                ? "border-brand bg-brand text-white"
                                : "border-line text-ink hover:border-ink/40"
                            )}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger className={controlClass(Boolean(collection))}>
                    <FunnelSimpleIcon size={18} aria-hidden />
                    Filters
                    {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                  </PopoverTrigger>
                  <PopoverContent align="center">
                    <p className="eyebrow px-1">Collection</p>{" "}
                    <ul className="px-1 pb-1">
                      {COLLECTIONS.map((c) => {
                        const on = collection === c.id
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              aria-pressed={on}
                              onClick={() => setCollection(on ? null : c.id)}
                              className={cn(
                                "flex min-h-11 w-full cursor-pointer items-center rounded-sm px-2 text-left text-base transition-colors hover:bg-pink-light",
                                on ? "text-brand" : "text-ink"
                              )}
                            >
                              {c.label}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>

              <Toggle
                checked={availableOnly}
                onChange={setAvailableOnly}
                label="Available Now"
              />
            </div>
            <p
              className="mt-3 text-center text-base text-ink-soft"
              aria-live="polite"
            >
              {loading
                ? "Searching…"
                : `${visible.length} ${visible.length === 1 ? "result" : "results"}`}
            </p>
          </div>

          <section className="px-4 py-8 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-3/4 animate-pulse rounded-sm bg-pink-light"
                  />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-sm bg-pink-light px-6 py-16 text-center">
                <p className="font-heading text-2xl font-medium text-ink">
                  {results.length === 0
                    ? `Nothing matches “${query}”`
                    : "No pieces match those filters"}
                </p>
                <p className="mx-auto mt-2 max-w-sm text-base text-ink-soft">
                  {results.length === 0
                    ? "Try a different keyword, or browse the collections."
                    : "Clear a filter to widen the results."}
                </p>
                {results.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSizes([])
                      setCollection(null)
                      setAvailableOnly(false)
                    }}
                    className="mt-6 min-h-11 cursor-pointer text-base font-medium text-brand underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                ) : (
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex min-h-11 items-center text-base font-medium text-brand underline underline-offset-4"
                  >
                    Browse all pieces
                  </Link>
                )}
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {visible.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </main>
  )
}
