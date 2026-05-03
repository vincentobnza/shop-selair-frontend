import { HeartIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import type { ShopProduct } from "@/components/shop/shop-filters"
import { useFavorite } from "@/features/favorites/useFavorite"
import { cn } from "@/lib/utils"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

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
    <article className={cn("my-2 group relative overflow-hidden", className)}>
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
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-black/2 transition hover:scale-105 active:scale-95 cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            void toggle()
          }}
        >
          <HeartIcon
            size={20}
            weight={saved ? "fill" : "regular"}
            className={saved ? "text-black" : "text-zinc-900"}
          />
        </button>
      </div>

      <Link to={to} className="mt-4 block">
        <div className="space-y-0.5">
          <div className="flex justify-between items-center">
            <h2
              className={cn(
                "font-heading font-medium text-zinc-900 line-clamp-1",
                compact ? "text-sm" : "text-sm md:text-base ",
              )}
            >
              {product.name}
            </h2>

            {product.sizes.length > 0 ? (
              <div className="flex max-w-[58%] shrink-0 flex-wrap items-center justify-end gap-x-1.5 gap-y-0.5 mr-2">
                {product.sizes.map((opt) => (
                  <span
                    key={opt.label}
                    title={opt.available ? undefined : "Unavailable"}
                    className={cn(
                      "text-sm font-heading font-medium",
                      opt.available
                        ? "text-zinc-900"
                        : "text-zinc-400 line-through decoration-zinc-400",
                    )}
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
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
