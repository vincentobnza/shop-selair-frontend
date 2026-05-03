import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks"
import * as favoritesApi from "@/features/favorites/api"
import {
  FAVORITES_LOCAL_KEY,
  LOCAL_FAVORITES_CHANGED,
  readLocalFavoriteIds,
  removeLocalFavoriteId,
} from "@/features/favorites/local-favorites"
import { useFavoriteStore } from "@/features/favorites/favoritesStore"
import { useCatalogProducts } from "@/features/products/queries"
import { useCallback, useEffect, useMemo, useState } from "react"
import EmptyStateImage from '@/assets/empty_favorite.png'

const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

export function FavoritesPage() {
  const { isAuthenticated } = useAuth()
  const { data: catalog = [], isPending: catalogPending } = useCatalogProducts()
  const loadFavorites = useFavoriteStore((s) => s.load)
  const remoteIds = useFavoriteStore((s) => s.ids)
  const favLoading = useFavoriteStore((s) => s.loading)
  const [guestEpoch, setGuestEpoch] = useState(0)

  const guestIds = useMemo(() => {
    void guestEpoch
    return readLocalFavoriteIds()
  }, [guestEpoch])

  const ids = isAuthenticated ? remoteIds : guestIds

  const rows = useMemo(() => {
    return ids.map((id) => ({
      id,
      product: catalog.find((p) => p.id === id),
    }))
  }, [ids, catalog])

  useEffect(() => {
    if (isAuthenticated) {
      void loadFavorites()
    }
  }, [isAuthenticated, loadFavorites])

  useEffect(() => {
    if (isAuthenticated) {
      return
    }
    const bump = () => {
      queueMicrotask(() => {
        setGuestEpoch((n) => n + 1)
      })
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_LOCAL_KEY || e.key === null) {
        bump()
      }
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(LOCAL_FAVORITES_CHANGED, bump)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(LOCAL_FAVORITES_CHANGED, bump)
    }
  }, [isAuthenticated])

  const remove = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        await favoritesApi.removeFavorite(Number(productId))
        await loadFavorites()
      } else {
        removeLocalFavoriteId(productId)
      }
    },
    [isAuthenticated, loadFavorites],
  )

  const showSkeleton =
    (catalogPending && ids.length > 0) ||
    (isAuthenticated && favLoading && ids.length === 0)

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 xl:py-24">
        <div className="mb-10 flex justify-center items-center gap-3">
          <h1 className="font-heading text-2xl text-center font-medium text-zinc-900 sm:text-3xl">
            All Favorites
          </h1>
        </div>

        {showSkeleton ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-lg bg-zinc-100"
              />
            ))}
          </div>
        ) : ids.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <img src={EmptyStateImage} alt="Empty favorites" className="w-24 h-24 mb-8 sm:mb-12 mx-auto" />
            <p className="font-heading text-base sm:text-lg lg:text-xl text-black">
              You have not saved anything yet.
            </p>

            <Button variant="outline" asChild className="mt-8 rounded-full px-8">
              <Link to="/shop">Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-black/10 border-t border-black/10">
            {rows.map(({ id, product }) => (
              <li key={id} className="py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <Link
                      to={`/products/${id}`}
                      className="relative w-40 aspect-3/4 shrink-0 overflow-hidden bg-zinc-100"
                    >
                      {product?.image[0] ? (
                        <img
                          src={product.image[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </Link>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase">
                        Wishlist
                      </p>
                      <Link
                        to={`/products/${id}`}
                        className="mt-1 block font-heading text-lg sm:text-xl lg:text-2xl font-medium text-zinc-900 hover:underline"
                      >
                        {product?.name ?? "Product unavailable"}
                      </Link>
                      {/* BRAND */}
                      <p className="text-xs sm:text-sm lg:text-base font-medium text-black/60">
                        {product?.brand ?? "Brand unavailable"}
                      </p>
                      {product ? (
                        <p className="mt-2 text-base sm:text-lg lg:text-xl font-medium text-zinc-700">
                          {php.format(product.price)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to={`/products/${id}`}>View Product</Link>
                    </Button>
                    <button
                      type="button"
                      className="text-sm font-medium text-zinc-500 underline"
                      onClick={() => void remove(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
