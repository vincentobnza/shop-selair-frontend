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
    for (const p of catalog) map.set(p.id, { name: p.name, slug: slugifyProductName(p.name) })
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
      <div className="flex flex-col items-center rounded-lg border border-dashed border-neutral-200 bg-zinc-50 px-6 py-16 text-center">
        <StarIcon size={40} className="text-zinc-300" />
        <p className="mt-3 font-heading text-lg text-zinc-900">No reviews yet</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-600">
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
      <h2 className="font-heading text-xl font-medium text-zinc-900">Your reviews</h2>
      <ul className="space-y-4">
        {reviews.map((r) => {
          const product = productById.get(r.product_id)
          return (
            <li key={r.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {product ? (
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-heading text-base font-medium text-zinc-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                  ) : (
                    <span className="font-heading text-base font-medium text-zinc-900">
                      Product
                    </span>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={r.rating} size={14} />
                    <span className="text-xs text-zinc-500">{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <button
                  className="text-sm font-medium text-red-700 hover:text-red-800"
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
                <p className="mt-3 text-sm font-medium text-zinc-900">{r.title}</p>
              ) : null}
              {r.body ? <p className="mt-1 text-sm text-zinc-600">{r.body}</p> : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
