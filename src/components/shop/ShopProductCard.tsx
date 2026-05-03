import { HeartIcon } from "@phosphor-icons/react"
import { useCallback, useState } from "react"
import { Link } from "react-router-dom"

import type { ShopProduct } from "@/components/shop/shop-filters"

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

type Props = { product: ShopProduct }

export function ShopProductCard({ product }: Props) {
  const to = `/products/${product.id}`
  const { saved, toggle } = useFavorite(product.id)

  return (
    <article className="group overflow-hidden">
      <div className="relative">
        <Link to={to} className="block">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "3 / 4" }}
          >
            <img
              src={product.image?.[0]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
            />
            {product.image?.[1] ? (
              <img
                src={product.image[1]}
                alt={`${product.name} (alternate)`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80  ring-1 ring-black/5 transition hover:scale-105 active:scale-95"
          onClick={(e) => {
            e.preventDefault()
            toggle()
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
        <h2 className="font-heading text-sm font-medium text-zinc-900 line-clamp-1 md:text-base">
          {product.name}
        </h2>
        <p className="mt-2 text-sm font-bold text-orange-900">
          From {currencyFormatter.format(product.price)}
        </p>
      </Link>
    </article>
  )
}
