import { CoatHangerIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"
import type { ShopProduct } from "@/components/shop/shop-filters"
import { AppImage } from "@/components/ui/app-image"
import { BRAND } from "@/config/brand"
import { useFavorite } from "@/features/favorites/useFavorite"
import { slugifyProductName } from "@/features/products/map"
import { cn } from "@/lib/utils"

const currencyFormatter = new Intl.NumberFormat(BRAND.locale, {
  style: "currency",
  currency: BRAND.currency,
  maximumFractionDigits: 0,
})

export type ProductCardProps = {
  product: ShopProduct
  className?: string
  /** Narrow rail variant: tighter type, single image, no hover swap. */
  compact?: boolean
}

/**
 * Product tile in the reference house style: a borderless white card whose
 * fill separates it from the paper ground, a favourite toggle floating over
 * the image, and a centred caption of name + collection + price. A second
 * image, when the catalog supplies one, cross-fades on hover.
 */
export function ProductCard({
  product,
  className,
  compact = false,
}: ProductCardProps) {
  const to = `/products/${slugifyProductName(product.name)}`
  const { saved, toggle } = useFavorite(product.id)
  const hasSwap = !compact && Boolean(product.image?.[1])
  const bookable =
    product.sizes.length === 0 || product.sizes.some((s) => s.available)

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm bg-white",
        className
      )}
    >
      <div className="relative">
        <Link to={to} className="block">
          <div
            className="relative w-full overflow-hidden bg-pink-light"
            style={{ aspectRatio: "3 / 4" }}
          >
            {hasSwap ? (
              <>
                <AppImage
                  src={product.image?.[0]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
                />
                <AppImage
                  src={product.image![1]}
                  alt={`${product.name}, alternate view`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              </>
            ) : (
              <AppImage
                src={product.image?.[0]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {!bookable ? (
              <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-base font-semibold text-ink">
                Fully booked
              </span>
            ) : null}
          </div>
        </Link>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${product.name} from favorites`
              : `Save ${product.name} to favorites`
          }
          className="absolute top-2 right-2 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:scale-105 active:scale-95"
          onClick={(e) => {
            e.preventDefault()
            void toggle()
          }}
        >
          <CoatHangerIcon
            size={18}
            weight={saved ? "fill" : "regular"}
            className={saved ? "text-brand" : "text-ink"}
          />
        </button>
      </div>

      <Link
        to={to}
        className="flex flex-1 flex-col items-center gap-2 px-4 py-4 text-center sm:py-5"
      >
        <h3
          className={cn(
            "line-clamp-2 text-ink",
            compact ? "text-base" : "text-base sm:text-lg"
          )}
        >
          {product.name}
        </h3>

        {product.brand ? (
          <p className="text-base font-semibold text-ink-soft">
            {product.brand}
          </p>
        ) : null}

        {/* Price is the decision point on a browse grid — it gets its own line
            and the largest weight in the caption. */}
        <p
          className={cn(
            "mt-auto pt-1 font-semibold text-ink",
            compact ? "text-lg" : "text-lg sm:text-xl"
          )}
        >
          <span className="text-base font-normal text-ink-soft">From </span>
          {currencyFormatter.format(product.price)}
        </p>
      </Link>
    </article>
  )
}
