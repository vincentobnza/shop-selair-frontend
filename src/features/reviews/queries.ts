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
