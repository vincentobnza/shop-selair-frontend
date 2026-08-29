import { useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { StarRating } from "@/components/StarRating"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toUserMessage } from "@/features/auth/errors"
import { useAuth } from "@/features/auth/hooks"
import { formatDate } from "@/features/orders/status"
import {
  useMyReviewForProduct,
  useProductReviews,
  useUpsertReview,
} from "@/features/reviews/queries"
export function ReviewsSection({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useProductReviews(productId)
  const { data: myReview } = useMyReviewForProduct(productId, isAuthenticated)
  const upsert = useUpsertReview(productId)

  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  // Prefill when the user's existing review loads.
  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating)
      setTitle(myReview.title ?? "")
      setBody(myReview.body ?? "")
    }
  }, [myReview])

  const summary = data?.summary
  const reviews = data?.data ?? []

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (rating < 1) {
      toast.error("Please select a star rating.")
      return
    }
    upsert.mutate(
      {
        rating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
      },
      {
        onSuccess: () => toast.success("Thanks for your review!"),
        onError: (err) => toast.error(toUserMessage(err)),
      }
    )
  }

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8"
    >
      <h2
        id="reviews-heading"
        className="font-heading text-2xl font-medium text-ink sm:text-3xl"
      >
        Ratings &amp; reviews
      </h2>

      <div className="mt-6 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Summary + form */}
        <div className="space-y-8">
          <div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-semibold text-ink">
                {summary && summary.count > 0
                  ? summary.average.toFixed(1)
                  : "—"}
              </span>
              <div className="pb-1">
                <StarRating value={summary?.average ?? 0} size={16} />
                <p className="mt-1 text-base text-ink-soft">
                  {summary?.count ?? 0}{" "}
                  {(summary?.count ?? 0) === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            {summary && summary.count > 0 ? (
              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.distribution[String(star) as "1"] ?? 0
                  const pct =
                    summary.count > 0 ? (count / summary.count) * 100 : 0
                  return (
                    <div
                      key={star}
                      className="flex items-center gap-2 text-base text-ink-soft"
                    >
                      <span className="w-3 tabular-nums">{star}</span>{" "}
                      <StarRating value={1} size={10} className="shrink-0" />{" "}
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-pink-light">
                        <span
                          className="block h-full rounded-full bg-amber-400"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-5 text-right tabular-nums">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Write review */}
          {isAuthenticated ? (
            <form
              onSubmit={submit}
              className="space-y-3 rounded-sm bg-white p-4"
            >
              <p className="text-base font-medium text-ink">
                {myReview ? "Update your review" : "Write a review"}
              </p>
              <StarRating
                value={rating}
                onChange={setRating}
                ariaLabel="Your rating"
              />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="h-10"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Share your experience (optional)"
                className="min-h-20 w-full resize-y rounded-sm bg-pink-light px-3 py-2 text-base text-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button
                type="submit"
                disabled={upsert.isPending}
                className="rounded-full px-6"
              >
                {upsert.isPending
                  ? "Submitting…"
                  : myReview
                    ? "Update review"
                    : "Submit review"}
              </Button>
              <p className="text-base text-ink-soft">
                Only customers who ordered this item can review it.
              </p>
            </form>
          ) : (
            <div className="rounded-sm bg-white p-4 text-base text-ink-soft">
              <Link
                to="/login"
                className="font-medium text-ink hover:underline"
              >
                Sign in
              </Link>{" "}
              to write a review.
            </div>
          )}
        </div>

        {/* Review list */}
        <div>
          {isLoading ? (
            <p className="text-base text-ink-soft">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-sm bg-pink-light px-6 py-12 text-center text-base text-ink-soft">
              No reviews yet — be the first to share your experience.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.id} className="py-5 first:pt-0">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} size={14} />
                    <span className="text-base font-medium text-ink">
                      {r.reviewer_name}
                    </span>
                  </div>
                  {r.title ? (
                    <p className="mt-2 text-base font-medium text-ink">
                      {r.title}
                    </p>
                  ) : null}
                  {r.body ? (
                    <p className="mt-1 text-base text-ink-soft">{r.body}</p>
                  ) : null}{" "}
                  <p className="mt-2 text-base text-ink-soft">
                    {formatDate(r.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
