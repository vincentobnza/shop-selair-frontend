import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { StarIcon } from "@phosphor-icons/react"

import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/features/orders/status"
import { slugifyProductName } from "@/features/products/map"
import { useCatalogProducts } from "@/features/products/queries"
import { usePendingReviews } from "@/features/reviews/queries"
import { ReviewComposerSheet } from "@/components/reviews/ReviewComposerSheet"
import type { PendingReview } from "@/features/reviews/types"

/**
 * "How was it?" — the pieces this customer has finished with and not reviewed.
 *
 * Reviews do not appear because a form exists; they appear because someone is
 * asked at the right moment. The right moment is once the hire is over, which
 * is exactly what the API's pending list means, so this prompt is the whole
 * feature as far as most customers are concerned. It disappears on its own as
 * each piece is reviewed.
 */
export function PendingReviewPrompts({ limit }: { limit?: number }) {
  const { data: pending = [], isLoading } = usePendingReviews()
  const { data: catalog = [] } = useCatalogProducts()
  /* The piece being written about, or null when the sheet is closed. */
  const [writing, setWriting] = useState<PendingReview | null>(null)

  const slugById = useMemo(() => {
    const map = new Map<string, string>()
    for (const product of catalog) {
      map.set(product.id, slugifyProductName(product.name))
    }
    return map
  }, [catalog])

  if (isLoading || pending.length === 0) return null

  const shown = limit ? pending.slice(0, limit) : pending

  return (
    <section
      aria-labelledby="pending-reviews-heading"
      className="rounded-sm bg-pink-light p-5"
    >
      <h3
        id="pending-reviews-heading"
        className="flex items-center gap-2 text-base font-medium text-ink"
      >
        <StarIcon className="size-5 text-brand" weight="fill" aria-hidden />
        How was it?
      </h3>
      <p className="mt-1 text-base text-ink-soft">
        {pending.length === 1
          ? "One piece you have worn is waiting for your review."
          : `${pending.length} pieces you have worn are waiting for your review.`}
      </p>

      <ul className="mt-4 space-y-3">
        {shown.map((item) => {
          const slug = slugById.get(item.product_id)
          return (
            <li
              key={item.product_id}
              className="flex flex-wrap items-center gap-4 rounded-sm bg-white p-3"
            >
              <div className="size-16 shrink-0 overflow-hidden bg-pink-light">
                {item.image_url ? (
                  <AppImage
                    src={item.image_url}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-ink">
                  {item.product_name}
                </p>
                <p className="mt-0.5 text-base text-ink-soft">
                  Order {item.order_number} · finished{" "}
                  {formatDate(item.finished_at)}
                </p>
              </div>

              {slug ? (
                <Button
                  variant="pill"
                  onClick={() => setWriting(item)}
                  className="h-11 shrink-0 px-6 text-base"
                >
                  Write a review
                </Button>
              ) : (
                <span className="text-base text-ink-soft">
                  No longer in the catalogue
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {writing ? (
        <ReviewComposerSheet
          open
          onOpenChange={(next) => !next && setWriting(null)}
          productId={writing.product_id}
          productName={writing.product_name}
          orderNumber={writing.order_number}
        />
      ) : null}

      {limit && pending.length > limit ? (
        <Link
          to="/account/reviews"
          className="mt-3 inline-block text-base font-medium text-ink hover:underline"
        >
          See all {pending.length} waiting
        </Link>
      ) : null}
    </section>
  )
}
