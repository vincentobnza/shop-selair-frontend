import { HeartIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import type { ShopProduct } from "@/components/shop/shop-filters"
import { StarRating } from "@/components/StarRating"
import { AppImage } from "@/components/ui/app-image"
import { useFavorite } from "@/features/favorites/useFavorite"
import { slugifyProductName } from "@/features/products/map"
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
  const to = `/products/${slugifyProductName(product.name)}`
  const { saved, toggle } = useFavorite(product.id)
  const hasSwap = !compact && Boolean(product.image?.[1])

  return (
    <article className={cn("group relative my-2 overflow-hidden", className)}>
      <div className="relative">
        <Link to={to} className="block">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "3 / 4" }}
          >
            {hasSwap ? (
              <>
                <AppImage
                  src={product.image?.[0]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:opacity-0"
                />
                <AppImage
                  src={product.image![1]}
                  alt={`${product.name} (alternate view)`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
                />
              </>
            ) : (
              <AppImage
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
          title={saved ? "Remove from favorites" : "Add to favorites"}
          aria-controls="favorite-button"
          className="absolute top-2 right-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-black/2 transition hover:scale-105 active:scale-95"
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
          <div className="flex items-center justify-between">
            <h2
              className={cn(
                "line-clamp-1 font-heading font-medium text-zinc-900",
                compact ? "text-sm" : "text-sm md:text-base"
              )}
            >
              {product.name}
            </h2>

            {product.sizes.length > 0 ? (
              <div className="mr-2 flex max-w-[58%] shrink-0 flex-wrap items-center justify-end gap-x-1.5 gap-y-0.5">
                {product.sizes.map((opt) => (
                  <span
                    key={opt.label}
                    title={opt.available ? undefined : "Unavailable"}
                    className={cn(
                      "font-heading text-sm font-medium",
                      opt.available
                        ? "text-zinc-900"
                        : "text-zinc-400 line-through decoration-zinc-400"
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
                  : "text-xs font-medium text-muted-foreground"
              )}
            >
              {product.brand}
            </p>
          ) : null}
        </div>
        <p
          className={cn(
            "mt-2 text-sm font-bold",
            compact ? "text-orange-900" : "text-primary"
          )}
        >
          {compact ? (
            <>From {currencyFormatter.format(product.price)}</>
          ) : (
            currencyFormatter.format(product.price)
          )}
        </p>
        {product.ratingCount > 0 ? (
          <div className="mt-1 flex items-center gap-1">
            <StarRating value={product.ratingAvg} size={12} />
            <span className="text-xs text-zinc-500">({product.ratingCount})</span>
          </div>
        ) : null}
      </Link>
    </article>
  )
}
