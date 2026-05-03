import { HeartIcon } from "@phosphor-icons/react"
import { useCallback, useState } from "react"
import { Link } from "react-router-dom"

import type { ShopProduct } from "@/components/shop/shop-filters"
import { cn } from "@/lib/utils"

const FAVORITES_KEY = "selair-favorites"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

function useFavorite(productId: string) {
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY)
      if (!raw) return false
      const ids = JSON.parse(raw) as string[]
      return Array.isArray(ids) && ids.includes(productId)
    } catch {
      return false
    }
  })

  const toggle = useCallback(() => {
    setSaved((prev) => {
      const next = !prev
      try {
        const raw = localStorage.getItem(FAVORITES_KEY)
        let ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
        if (!Array.isArray(ids)) ids = []
        if (next) {
          if (!ids.includes(productId)) ids = [...ids, productId]
        } else {
          ids = ids.filter((id) => id !== productId)
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [productId])

  return { saved, toggle }
}

export type ProductCardProps = {
  product: ShopProduct
  className?: string
  /** Narrow carousel: single image, “From” price, bolder brand */
  compact?: boolean
}

export function ProductCard({
  product,
  className,
  compact = false,
}: ProductCardProps) {
  const to = `/products/${product.id}`
  const { saved, toggle } = useFavorite(product.id)
  const hasSwap = !compact && Boolean(product.image?.[1])

  return (
    <article className={cn("group relative overflow-hidden", className)}>
      <div className="relative">
        <Link to={to} className="block">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "3 / 4" }}
          >
            {hasSwap ? (
              <>
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:opacity-0"
                />
                <img
                  src={product.image![1]}
                  alt={`${product.name} (alternate view)`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
                />
              </>
            ) : (
              <img
                src={product.image?.[0]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </Link>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-black/5 transition hover:scale-105 active:scale-95"
          onClick={(e) => {
            e.preventDefault()
            toggle()
          }}
        >
          <HeartIcon
            size={20}
            weight={saved ? "fill" : "regular"}
            className={saved ? "text-red-500" : "text-zinc-900"}
          />
        </button>
      </div>

      <Link to={to} className="mt-4 block">
        <div className="space-y-0.5">
          <h2
            className={cn(
              "font-heading font-medium text-zinc-900 line-clamp-1",
              compact ? "text-sm" : "text-sm md:text-base",
            )}
          >
            {product.name}
          </h2>
          {product.brand ? (
            <p
              className={cn(
                compact
                  ? "text-sm font-bold text-zinc-900"
                  : "text-xs font-medium text-muted-foreground",
              )}
            >
              {product.brand}
            </p>
          ) : null}
        </div>
        <p
          className={cn(
            "mt-2 text-sm font-bold",
            compact ? "text-orange-900" : "text-primary",
          )}
        >
          {compact ? (
            <>From {currencyFormatter.format(product.price)}</>
          ) : (
            currencyFormatter.format(product.price)
          )}
        </p>
      </Link>
    </article>
  )
}
