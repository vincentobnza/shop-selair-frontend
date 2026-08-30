import { CoatHangerIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"
import type { ShopProduct } from "@/components/shop/shop-filters"
import { AppImage } from "@/components/ui/app-image"
import { BRAND } from "@/config/brand"
import { useFavorite } from "@/features/favorites/useFavorite"
import {
  availabilityLabel,
  productAvailability,
} from "@/features/products/availability"
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
  /**
   * Narrow rail variant: tighter type and a smaller price.
   *
   * Density only. It used to suppress the hover image swap as well, which meant
   * the same piece behaved one way on the shop grid and another in a home rail
   * for no reason a customer could see.
   */
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
  /* Every card that has a second photograph swaps on hover, in every rail and
     grid. The only thing that disables it is the catalog not supplying one. */
  const hasSwap = Boolean(product.image?.[1])

  const availability = productAvailability(product)
  const unavailableLabel = availabilityLabel(availability)
  const unavailable = unavailableLabel !== null

  /*
   * Drain the colour from an unavailable piece.
   *
   * The scrim and the label say it in words; the desaturation is what makes it
   * legible while scanning a grid at speed, before anyone reads anything. It
   * sits on the image only — the name and price below stay full contrast, so
   * the tile is still readable rather than uniformly dimmed.
   */
  const imageTone = unavailable
    ? "grayscale opacity-90 transition-[filter,opacity] duration-300"
    : ""

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
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0",
                    imageTone
                  )}
                />
                {/*
                  * Low priority: it sits in the viewport under the primary
                  * photograph, so `loading="lazy"` will not defer it — but it
                  * is invisible until someone hovers, and must not compete for
                  * bandwidth with the images actually on screen. This matters
                  * most on the home page, where a rail can hold a dozen cards.
                  */}
                <AppImage
                  src={product.image![1]}
                  alt=""
                  aria-hidden
                  fetchPriority="low"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100",
                    imageTone
                  )}
                />
              </>
            ) : (
              <AppImage
                src={product.image?.[0]}
                alt={product.name}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover",
                  imageTone
                )}
              />
            )}

            {unavailable ? (
              /*
               * The overlay covers the image, not the caption: the name and
               * price stay legible, because someone deciding whether to wait
               * for a piece to come back still needs to know what it is and
               * what it costs.
               *
               * `pointer-events-none` keeps the whole tile clickable — an
               * unavailable piece is still worth opening and saving, and an
               * overlay that swallowed the click would read as a broken card.
               */
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/20">
                {/* Solid, not translucent: many of these pieces photograph on
                    a white ground, and a see-through pill on a pale garment is
                    the one place this stops being readable. */}
                <span className="rounded-full bg-white px-4 py-2 text-base font-semibold tracking-wide text-ink uppercase shadow-md ring-1 ring-ink/10">
                  {unavailableLabel}
                </span>
              </div>
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
