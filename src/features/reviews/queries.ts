import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { catalogKeys } from "@/features/products/queries"
import * as reviewsApi from "./api"
import type { ReviewInput } from "./types"

export const reviewKeys = {
  all: ["reviews"] as const,
  product: (productId: string) =>
    [...reviewKeys.all, "product", productId] as const,
  mineForProduct: (productId: string) =>
    [...reviewKeys.all, "mine-for-product", productId] as const,
  mine: () => [...reviewKeys.all, "mine"] as const,
  eligibility: (productId: string) =>
    [...reviewKeys.all, "eligibility", productId] as const,
  pending: () => [...reviewKeys.all, "pending"] as const,
}

/**
 * Whether the signed-in customer may review this piece.
 *
 * Asked before the composer is rendered: the shop only takes a review from
 * someone who has finished with the piece, and finding that out by having a
 * submission refused is the worst possible moment to learn it.
 */
export function useReviewEligibility(
  productId: string | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey: reviewKeys.eligibility(productId ?? ""),
    queryFn: () => reviewsApi.fetchReviewEligibility(productId as string),
    enabled: Boolean(productId) && enabled,
  })
}

/** Pieces this customer has finished with and not yet reviewed. */
export function usePendingReviews(enabled = true) {
  return useQuery({
    queryKey: reviewKeys.pending(),
    queryFn: () => reviewsApi.fetchPendingReviews(),
    enabled,
  })
}

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.product(productId ?? ""),
    queryFn: () => reviewsApi.fetchProductReviews(productId as string),
    enabled: Boolean(productId),
  })
}

export function useMyReviewForProduct(
  productId: string | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey: reviewKeys.mineForProduct(productId ?? ""),
    queryFn: () => reviewsApi.fetchMyReviewForProduct(productId as string),
    enabled: Boolean(productId) && enabled,
  })
}

export function useMyReviews(enabled = true) {
  return useQuery({
    queryKey: reviewKeys.mine(),
    queryFn: () => reviewsApi.fetchMyReviews(),
    enabled,
  })
}

export function useUpsertReview(productId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ReviewInput) =>
      reviewsApi.upsertReview(productId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.product(productId) })
      qc.invalidateQueries({ queryKey: reviewKeys.mineForProduct(productId) })
      qc.invalidateQueries({ queryKey: reviewKeys.mine() })
      qc.invalidateQueries({ queryKey: reviewKeys.eligibility(productId) })
      /* The prompt for this piece has been answered; drop it from the list. */
      qc.invalidateQueries({ queryKey: reviewKeys.pending() })
      // Refresh catalog so aggregate rating on cards/detail updates.
      qc.invalidateQueries({ queryKey: catalogKeys.all })
    },
  })
}

export function useDeleteReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  })
}
