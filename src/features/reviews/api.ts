import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type {
  PendingReview,
  ProductReviews,
  Review,
  ReviewEligibility,
  ReviewInput,
} from "./types"

export async function fetchProductReviews(
  productId: string,
  perPage = 20
): Promise<ProductReviews> {
  const res = await api.get<ProductReviews>(
    apiPath(`products/${productId}/reviews`),
    {
      params: { per_page: perPage },
    }
  )
  return res.data
}

export async function fetchMyReviewForProduct(
  productId: string
): Promise<Review | null> {
  const res = await api.get<{ data: Review | null }>(
    apiPath(`products/${productId}/reviews/me`)
  )
  return res.data.data
}

export async function upsertReview(
  productId: string,
  input: ReviewInput
): Promise<Review> {
  const res = await api.post<{ data: Review }>(
    apiPath(`products/${productId}/reviews`),
    input
  )
  return res.data.data
}

export async function fetchMyReviews(): Promise<Review[]> {
  const res = await api.get<{ data: Review[] }>(apiPath("reviews/mine"), {
    params: { per_page: 50 },
  })
  return res.data.data
}

export async function deleteReview(reviewId: string): Promise<void> {
  await api.delete(apiPath(`reviews/${reviewId}`))
}

export async function fetchReviewEligibility(
  productId: string
): Promise<ReviewEligibility> {
  const res = await api.get<{ data: ReviewEligibility }>(
    apiPath(`products/${productId}/reviews/eligibility`)
  )
  return res.data.data
}

export async function fetchPendingReviews(): Promise<PendingReview[]> {
  const res = await api.get<{ data: PendingReview[] }>(
    apiPath("reviews/pending")
  )
  return res.data.data
}
