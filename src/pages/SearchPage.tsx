import { useEffect, useState, type FormEvent } from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchPublicProducts } from "@/features/products/api"
import { toCatalogProduct } from "@/features/products/map"
import type { CatalogProduct } from "@/features/products/types"

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get("q")?.trim() ?? ""
  const [input, setInput] = useState(query)

  useEffect(() => {
    setInput(query)
  }, [query])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: async (): Promise<CatalogProduct[]> => {
      const rows = await searchPublicProducts(query, { perPage: 60 })
      return rows.map(toCatalogProduct)
    },
    enabled: query.length > 0,
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    setParams(q ? { q } : {}, { replace: false })
  }

  const results = data ?? []

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <h1 className="font-heading text-2xl font-medium text-zinc-900 sm:text-3xl">Search</h1>

        <form onSubmit={onSubmit} className="mt-4 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              size={18}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <Input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search dresses, gowns, brands…"
              className="h-11 pl-9"
            />
          </div>
          <Button type="submit" className="h-11 rounded-full px-6">
            Search
          </Button>
        </form>

        <div className="mt-8">
          {query.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Type a keyword above to find pieces by name, brand, or SKU.
            </p>
          ) : isLoading || isFetching ? (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] w-full rounded-lg bg-zinc-100" />
                  <div className="mt-3 h-4 w-2/3 rounded-sm bg-zinc-100" />
                  <div className="mt-2 h-3 w-1/3 rounded-sm bg-zinc-100" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 bg-zinc-50 px-6 py-16 text-center">
              <p className="font-heading text-lg text-zinc-900">
                No results for “{query}”
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Try a different keyword or browse the full shop.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-zinc-600">
                {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
              </p>
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
