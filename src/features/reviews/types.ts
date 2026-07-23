export type Review = {
  id: string
  product_id: string
  user_id: string
  reviewer_name: string
  rating: number
  title: string | null
  body: string | null
  created_at: string | null
  updated_at: string | null
}

export type RatingSummary = {
  average: number
  count: number
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>
}

export type ProductReviews = {
  data: Review[]
  total: number
  summary: RatingSummary
}

export type ReviewInput = {
  rating: number
  title?: string
  body?: string
}
