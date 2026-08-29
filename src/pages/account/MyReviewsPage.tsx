import { useMemo } from "react"
import { StarIcon } from "@phosphor-icons/react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { StarRating } from "@/components/StarRating"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { toUserMessage } from "@/features/auth/errors"
import { useCatalogProducts } from "@/features/products/queries"
import { slugifyProductName } from "@/features/products/map"
import { useDeleteReview, useMyReviews } from "@/features/reviews/queries"
import { formatDate } from "@/features/orders/status"
export function MyReviewsPage() {
  const { data: reviews, isLoading } = useMyReviews()
  const { data: catalog = [] } = useCatalogProducts()
  const del = useDeleteReview()

  const productById = useMemo(() => {
    const map = new Map<string, { name: string; slug: string }>()
    for (const p of catalog)
      map.set(p.id, { name: p.name, slug: slugifyProductName(p.name) })
    return map
  }, [catalog])

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <DotPulse />
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-sm bg-pink-light px-6 py-16 text-center">
        <StarIcon size={40} className="text-line" />{" "}
        <p className="mt-3 text-lg text-ink">No reviews yet</p>{" "}
        <p className="mt-1 max-w-sm text-base text-ink-soft">
          Review the pieces you’ve ordered to help other renters choose.
        </p>
        <Button variant="outline" asChild className="mt-6 rounded-full px-8">
          <Link to="/account/orders">View your orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium text-ink">Your reviews</h2>{" "}
      <ul className="space-y-4">
        {reviews.map((r) => {
          const product = productById.get(r.product_id)
          return (
            <li key={r.id} className="rounded-sm bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {product ? (
                    <Link
                      to={`/products/${product.slug}`}
                      className="text-base font-medium text-ink hover:underline"
                    >
                      {product.name}
                    </Link>
                  ) : (
                    <span className="text-base font-medium text-ink">
                      Product
                    </span>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={r.rating} size={14} />
                    <span className="text-base text-ink-soft">
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                </div>
                <button
                  className="text-base font-medium text-red-700 hover:text-red-800"
                  onClick={() =>
                    del.mutate(r.id, {
                      onSuccess: () => toast.success("Review deleted."),
                      onError: (e) => toast.error(toUserMessage(e)),
                    })
                  }
                >
                  Delete
                </button>
              </div>
              {r.title ? (
                <p className="mt-3 text-base font-medium text-ink">{r.title}</p>
              ) : null}
              {r.body ? (
                <p className="mt-1 text-base text-ink-soft">{r.body}</p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
