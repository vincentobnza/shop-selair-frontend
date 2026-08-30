import { Link } from "react-router-dom"

import { FeaturedReviewCard } from "@/components/reviews/FeaturedReviewCard"
import { StarRating } from "@/components/StarRating"
import { useFeaturedReviews } from "@/features/reviews/queries"

/** The floor for what appears here. Four and five stars only. */
const MIN_RATING = 4

/**
 * Exactly one row of three. The home page is a sample, not the archive — the
 * fourth review onwards lives behind "View all".
 */
const ROW_SIZE = 3

/**
 * What customers said — the social-proof band beneath the FAQ.
 *
 * Shows only reviews at four stars and above, which is a merchandising choice
 * rather than a reporting one. Two things follow from that, and both are
 * deliberate:
 *
 * - The headline count and average describe **every** review the shop has, not
 *   the filtered set. A "5.0" computed from only the five-star rows would read
 *   as the shop's score while being arithmetic on a hand-picked sample.
 * - "View all" leads to the unfiltered page, so nothing is hidden behind the
 *   curation — the low ratings are one click away, by design.
 *
 * Renders nothing at all when there is nothing to show. An empty "what people
 * say" band on a landing page says something worse than silence does.
 */
export function CustomerReviews() {
  const { data, isLoading } = useFeaturedReviews(MIN_RATING, ROW_SIZE)

  if (isLoading) {
    return (
      <section className="bg-paper" aria-hidden>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto h-8 w-64 animate-pulse rounded-full bg-pink-light" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-[1.25rem] bg-pink-light"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const reviews = data?.data ?? []
  if (reviews.length === 0) return null

  const { average, count } = data?.summary ?? { average: 0, count: 0 }
  /* Only worth offering when there is more behind it than the row already
     shows — a "View all" that leads to the same three cards is a dead end. */
  const hasMore = (data?.total ?? 0) > reviews.length

  return (
    <section
      className="bg-paper"
      id="reviews"
      aria-labelledby="home-reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">Reviews</p>
        <h2
          id="home-reviews-heading"
          className="mt-2 text-center font-heading text-3xl leading-tight font-medium text-ink sm:text-4xl"
        >
          Ratings &amp; Reviews
        </h2>

        {count > 0 ? (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-base text-ink-soft">
            <StarRating
              value={average}
              size={18}
              ariaLabel={`${average} out of 5 stars`}
            />
            <span className="font-semibold text-ink">{average.toFixed(1)}</span>
            <span aria-hidden>·</span>
            {/* Every review, not just the ones below — said plainly so the
                number cannot be read as describing the filtered cards. */}
            <span>
              {count} {count === 1 ? "review" : "reviews"} across the shop
            </span>
          </div>
        ) : null}

        {/*
          One row, three columns, and never a second row: the query asks for
          three, so a fourth review changes what is shown here but not how much.
          Below `lg` it falls to two and then one, because three 320px cards do
          not fit a phone — the constraint is "one row of three" at the width
          that has room for it, not three across at any width.
        */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <FeaturedReviewCard key={review.id} review={review} clamp />
          ))}
        </ul>

        {hasMore ? (
          <div className="mt-10 text-center">
            <Link
              to="/reviews"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand px-8 text-base font-medium text-brand transition-colors hover:bg-brand hover:text-white"
            >
              View all reviews
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
