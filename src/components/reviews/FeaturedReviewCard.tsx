import { Link } from "react-router-dom"

import { StarRating } from "@/components/StarRating"
import { AppImage } from "@/components/ui/app-image"
import { slugifyProductName } from "@/features/products/map"
import { fileUrl } from "@/lib/api-base"
import type { FeaturedReview } from "@/features/reviews/types"
import { cn } from "@/lib/utils"

/**
 * One review, shown away from its own product page.
 *
 * Shared by the home row and the reviews page so the two cannot drift — the
 * home row is a three-card sample of exactly what the full page shows, and a
 * second copy of this markup is how they stop looking like the same thing.
 *
 * `clamp` is the only difference between the two surfaces: the home row keeps
 * every card the same height so the row reads as a row, while the full page
 * lets a review run as long as it was written.
 */
export function FeaturedReviewCard({
  review,
  clamp = false,
}: {
  review: FeaturedReview
  clamp?: boolean
}) {
  const to = `/products/${slugifyProductName(review.product.name)}`

  return (
    <li className="flex h-full flex-col rounded-[1.25rem] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <StarRating
          value={review.rating}
          size={16}
          ariaLabel={`${review.rating} out of 5 stars`}
        />
        {review.verified ? (
          <span className="rounded-full bg-pink-light px-2.5 py-1 text-sm font-semibold text-ink-soft">
            Verified rental
          </span>
        ) : null}
      </div>

      {review.title ? (
        <p className="mt-3 text-base font-semibold text-ink">{review.title}</p>
      ) : null}

      {review.body ? (
        <p
          className={cn(
            "mt-2 text-base leading-relaxed text-ink-soft",
            clamp && "line-clamp-5"
          )}
        >
          {review.body}
        </p>
      ) : null}

      <p className="mt-3 text-base text-ink-soft">{review.reviewer_name}</p>

      {/*
        The piece the review is about, and the way through to its full,
        unfiltered feedback. `mt-auto` pins it to the bottom so cards of
        different text lengths still line up along a row.
      */}
      <Link
        to={to}
        className="group mt-auto flex items-center gap-3 pt-4 text-left"
      >
        <span className="size-12 shrink-0 overflow-hidden rounded-l bg-pink-light">
          {review.product.image ? (
            /*
             * Through `fileUrl`, not raw. Uploaded product photos are stored
             * root-relative (`/uploads/products/x.jpg`) so the origin can move
             * without rewriting rows — rendered as-is the browser resolves them
             * against the storefront instead of the API and they 404. Seeded
             * absolute URLs pass through untouched, which is why this only
             * showed on the one product with a real upload.
             */
            <AppImage
              src={fileUrl(review.product.image)}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-ink-soft">Reviewed</span>
          <span className="line-clamp-1 text-base font-medium text-ink underline-offset-4 group-hover:underline">
            {review.product.name}
          </span>
        </span>
      </Link>
    </li>
  )
}
