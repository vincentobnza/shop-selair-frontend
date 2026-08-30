import { useState } from "react"

import { FeaturedReviewCard } from "@/components/reviews/FeaturedReviewCard"
import { StarRating } from "@/components/StarRating"
import { EmptyState } from "@/components/ui/empty-state"
import { useAllReviews } from "@/features/reviews/queries"
import { cn } from "@/lib/utils"

/** `null` is "everything"; a number narrows to that single star band. */
type RatingFilter = number | null

const STARS = [5, 4, 3, 2, 1] as const

/**
 * Every review the shop has, newest first.
 *
 * Reached from "View all" on the home page, and deliberately *unfiltered* by
 * default: the home row shows four stars and up because it is merchandising,
 * but a page offered as "view all" that quietly withheld the one-star reviews
 * would be worse than never linking to it. The filter here is the reader's to
 * set, not the shop's.
 */
export function ReviewsPage() {
  const [rating, setRating] = useState<RatingFilter>(null)
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAllReviews(rating)

  const reviews = data?.pages.flatMap((page) => page.data) ?? []
  const summary = data?.pages[0]?.summary
  const total = data?.pages[0]?.total ?? 0

  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="text-center">
          <p className="eyebrow">Reviews</p>
          <h1 className="mt-2 font-heading text-3xl leading-tight font-medium text-ink sm:text-4xl">
            Ratings &amp; Reviews
          </h1>

          {summary && summary.count > 0 ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-base text-ink-soft">
              <StarRating
                value={summary.average}
                size={18}
                ariaLabel={`${summary.average} out of 5 stars`}
              />
              <span className="font-semibold text-ink">
                {summary.average.toFixed(1)}
              </span>
              <span aria-hidden>·</span>
              <span>
                {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : null}
        </header>

        {summary && summary.count > 0 ? (
          <div
            role="group"
            aria-label="Filter reviews by rating"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <FilterChip
              active={rating === null}
              onClick={() => setRating(null)}
              label="All ratings"
              count={summary.count}
            />
            {STARS.map((star) => {
              const starCount = summary.distribution[String(star) as "1"] ?? 0
              return (
                <FilterChip
                  key={star}
                  active={rating === star}
                  /* Nothing to show behind it, so it does not invite the click.
                     Hiding it instead would make the row jump around as reviews
                     come in; disabled keeps the scale readable. */
                  disabled={starCount === 0}
                  onClick={() => setRating(star)}
                  label={`${star} star${star === 1 ? "" : "s"}`}
                  count={starCount}
                />
              )
            })}
          </div>
        ) : null}

        {isLoading ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <li
                key={i}
                className="h-56 animate-pulse rounded-[1.25rem] bg-pink-light"
              />
            ))}
          </ul>
        ) : isError ? (
          <div className="mt-10">
            <EmptyState
              art="bell"
              title="We could not load the reviews"
              description="Check your connection and refresh the page."
            />
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              art="rack"
              title={
                rating === null
                  ? "No reviews yet"
                  : `No ${rating}-star reviews yet`
              }
              description={
                rating === null
                  ? "Once customers have worn and returned their pieces, what they thought will appear here."
                  : "Try another rating, or view them all."
              }
            />
          </div>
        ) : (
          <>
            <p className="mt-8 text-base text-ink-soft">
              {total} {total === 1 ? "review" : "reviews"}
              {rating === null ? "" : ` rated ${rating} stars`}
            </p>

            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <FeaturedReviewCard key={review.id} review={review} />
              ))}
            </ul>

            {hasNextPage ? (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => void fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-brand px-8 text-base font-medium text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading…" : "View more"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}

function FilterChip({
  active,
  disabled,
  onClick,
  label,
  count,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-base transition-colors",
        active
          ? "bg-brand font-semibold text-white"
          : "bg-white text-ink hover:bg-pink-light",
        disabled && "cursor-not-allowed opacity-40 hover:bg-white"
      )}
    >
      {label}
      <span className={cn("text-sm", active ? "text-white/80" : "text-ink-soft")}>
        {count}
      </span>
    </button>
  )
}
