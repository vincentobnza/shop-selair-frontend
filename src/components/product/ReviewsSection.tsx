import { useState } from "react"
import { Link } from "react-router-dom"
import { PencilSimpleIcon, SealCheckIcon } from "@phosphor-icons/react"

import { StarRating } from "@/components/StarRating"
import { ReviewComposerSheet } from "@/components/reviews/ReviewComposerSheet"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks"
import { formatDate } from "@/features/orders/status"
import {
  useProductReviews,
  useReviewEligibility,
} from "@/features/reviews/queries"

/**
 * What other customers said — and nothing else.
 *
 * This section is for reading. The composer used to sit in a column beside the
 * reviews, which asked every visitor to write one (most of them cannot) and
 * halved the width available to the thing they actually came for. Writing now
 * happens in a sheet, opened by the one person on the page entitled to: someone
 * whose hire has finished.
 */
export function ReviewsSection({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useProductReviews(productId)
  const { data: eligibility } = useReviewEligibility(productId, isAuthenticated)
  const [composerOpen, setComposerOpen] = useState(false)

  const summary = data?.summary
  const reviews = data?.data ?? []
  const count = summary?.count ?? 0

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="scroll-mt-20 border-t border-line py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="reviews-heading"
              className="font-heading text-2xl font-medium text-ink sm:text-3xl"
            >
              Ratings &amp; reviews
            </h2>
            <p className="mt-1 text-base text-ink-soft">
              {count > 0
                ? `${count} ${count === 1 ? "review" : "reviews"} from customers who wore this piece.`
                : "Only customers who have worn this piece can review it."}
            </p>
          </div>

          {eligibility?.can_review ? (
            <Button
              type="button"
              variant="pill"
              onClick={() => setComposerOpen(true)}
              className="h-12 px-6 text-base font-semibold"
            >
              <PencilSimpleIcon className="size-5" aria-hidden />
              {eligibility.has_reviewed
                ? "Update your review"
                : "Write a review"}
            </Button>
          ) : null}
        </header>

        {count > 0 && summary ? (
          <div className="mt-8 flex flex-col gap-8 rounded-sm bg-white p-6 sm:flex-row sm:items-center sm:gap-12">
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-heading text-5xl font-semibold text-ink">
                {summary.average.toFixed(1)}
              </span>
              <div>
                <StarRating value={summary.average} size={18} />
                <p className="mt-1 text-base text-ink-soft">
                  out of 5 · {count} {count === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            {/* The distribution reads across the full width now, so the bars
                are long enough to compare at a glance. */}
            <div className="min-w-0 flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const starCount = summary.distribution[String(star) as "1"] ?? 0
                const pct = count > 0 ? (starCount / count) * 100 : 0
                return (
                  <div
                    key={star}
                    className="flex items-center gap-3 text-base text-ink-soft"
                  >
                    <span className="w-3 tabular-nums">{star}</span>
                    <StarRating value={1} size={11} className="shrink-0" />
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-pink-light">
                      <span
                        className="block h-full rounded-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-6 text-right tabular-nums">
                      {starCount}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          {isLoading ? (
            <p className="text-base text-ink-soft">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-sm bg-pink-light px-6 py-14 text-center">
              <p className="text-lg font-medium text-ink sm:text-2xl">
                No reviews yet
              </p>
              <p className="mt-1 text-base text-ink-soft">
                {eligibility?.can_review
                  ? "You have worn this piece — yours would be the first."
                  : "Reviews appear here once customers have worn this piece."}
              </p>
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="mt-3 inline-block text-base font-medium text-ink underline"
                >
                  Sign in
                </Link>
              ) : null}
            </div>
          ) : (
            /* Two columns on a wide screen: full-bleed single-column reviews
               leave a paragraph of text stretched across a desktop, which is
               harder to read, not easier. */
            <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="border-t border-line pt-5 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating value={review.rating} size={14} />
                    <span className="text-base font-medium text-ink">
                      {review.reviewer_name}
                    </span>
                    {review.verified ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-pink-light px-2 py-0.5 text-xs font-medium text-ink-soft"
                        title="This customer rented this piece"
                      >
                        <SealCheckIcon
                          className="size-3.5 text-blue-600"
                          weight="fill"
                          aria-hidden
                        />
                        Verified rental
                      </span>
                    ) : null}
                  </div>

                  {review.title ? (
                    <p className="mt-2 text-base font-medium text-ink">
                      {review.title}
                    </p>
                  ) : null}
                  {review.body ? (
                    <p className="mt-1 text-base leading-relaxed text-ink-soft">
                      {review.body}
                    </p>
                  ) : null}
                  <p className="mt-2 text-base text-ink-soft">
                    {formatDate(review.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {eligibility?.can_review ? (
        <ReviewComposerSheet
          open={composerOpen}
          onOpenChange={setComposerOpen}
          productId={productId}
          productName={productName}
          orderNumber={eligibility.order_number}
        />
      ) : null}
    </section>
  )
}
