export type Review = {
  id: string
  product_id: string
  user_id: string
  reviewer_name: string
  rating: number
  title: string | null
  body: string | null
  /** True when a finished order backs this review. */
  verified?: boolean
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

/** Why the shop will not take a review from this person for this piece. */
export type IneligibleReason = "not_ordered" | "not_received"

export type ReviewEligibility = {
  can_review: boolean
  reason: IneligibleReason | null
  has_reviewed: boolean
  /** The finished order that earns the review. */
  order_number: string | null
  /** The day the customer finished with the piece, `yyyy-MM-dd`. */
  finished_at: string | null
}

/** A piece the customer has finished with and has not reviewed yet. */
export type PendingReview = {
  product_id: string
  product_name: string
  image_url: string | null
  order_number: string
  finished_at: string
}

/** A review shown away from its product page, so it carries the piece with it. */
export type FeaturedReview = Review & {
  product: {
    id: string
    name: string
    /** First photograph only — a thumbnail, not the gallery. */
    image: string | null
  }
}

export type FeaturedReviews = {
  data: FeaturedReview[]
  /**
   * How many reviews clear `min_rating` in total — not how many came back.
   * The home row shows three; this is what tells it whether a "View all" has
   * anything behind it.
   */
  total: number
  /**
   * Across EVERY review, not only the ones in `data`. An average taken from the
   * filtered set would read as the shop's score while being arithmetic on a
   * hand-picked sample.
   */
  summary: RatingSummary
  /** The floor the returned reviews were filtered to. */
  min_rating: number
}

/** One page of the full, unfiltered review list. */
export type AllReviews = {
  data: FeaturedReview[]
  total: number
  current_page: number
  last_page: number
  per_page: number
  summary: RatingSummary
}
