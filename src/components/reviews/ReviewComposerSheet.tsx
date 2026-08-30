import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { StarRating } from "@/components/StarRating"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { toUserMessage } from "@/features/auth/errors"
import {
  useMyReviewForProduct,
  useUpsertReview,
} from "@/features/reviews/queries"

type ReviewComposerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productName: string
  /** The finished order that earned the review, shown as reassurance. */
  orderNumber?: string | null
}

/** What each star means, so a rating is a judgement rather than a guess. */
const RATING_WORDS = [
  "",
  "Not for me",
  "Some problems",
  "It was fine",
  "Really good",
  "Perfect",
]

/**
 * Writing a review — in the sheet this storefront already uses for decisions.
 *
 * The product page is where reviews are *read*; a blank form sitting beside
 * them asks every visitor to write one, including everyone who cannot. So the
 * composer is opened deliberately instead: from the prompt in the account after
 * a hire ends, or from the piece itself once the customer has actually had it.
 */
export function ReviewComposerSheet({
  open,
  onOpenChange,
  productId,
  productName,
  orderNumber,
}: ReviewComposerSheetProps) {
  const { data: existing } = useMyReviewForProduct(productId, open)
  const upsert = useUpsertReview(productId)

  const [rating, setRating] = useState(0)
  const [body, setBody] = useState("")

  /*
   * Load whatever they wrote last time, once it arrives and again if it
   * changes. Done during render rather than in an effect so the fields never
   * flash empty first — someone editing their review should see their own words
   * straight away, not a blank box that fills in a moment later.
   */
  const [loadedFrom, setLoadedFrom] = useState<string | null>(null)
  if (open && existing && existing.updated_at !== loadedFrom) {
    setLoadedFrom(existing.updated_at)
    setRating(existing.rating)
    setBody(existing.body ?? "")
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (rating < 1) {
      toast.error("Please choose a star rating.")
      return
    }

    upsert.mutate(
      {
        rating,
        body: body.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            existing
              ? "Your review has been updated."
              : "Thanks for your review!"
          )
          onOpenChange(false)
        },
        onError: (error) => toast.error(toUserMessage(error)),
      }
    )
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={existing ? "Update your review" : "How was it?"}
      description={
        orderNumber ? `${productName} · order ${orderNumber}` : productName
      }
      footer={
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            type="submit"
            form="review-composer"
            variant="pill"
            disabled={upsert.isPending}
            className="h-12 w-full shrink-0 text-base font-semibold sm:w-auto sm:flex-1"
          >
            {upsert.isPending
              ? "Submitting…"
              : existing
                ? "Update review"
                : "Submit review"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 w-full shrink-0 rounded-full border-line text-base sm:w-auto sm:flex-1"
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* The submit button lives in the sheet's footer, so it reaches the form
          by id rather than by nesting. */}
      <form id="review-composer" onSubmit={submit} className="space-y-5 pb-2">
        <div className="text-center">
          <p className="text-base font-medium text-ink">Your rating</p>
          <StarRating
            value={rating}
            onChange={setRating}
            size={34}
            ariaLabel="Your rating"
            className="mt-2 justify-center"
          />
          <p className="mt-1 min-h-6 text-base text-ink-soft">
            {RATING_WORDS[rating] ?? ""}
          </p>
        </div>

        <div>
          <label
            htmlFor="review-body"
            className="mb-1.5 block text-base font-medium text-ink"
          >
            Your review{" "}
            <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="How did it fit? How did it wear through the day?"
            className="min-h-32 w-full resize-y rounded-sm bg-pink-light px-3 py-2.5 text-base text-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <p className="mt-1 text-base text-ink-soft">
            Shown on this piece with your first name and a verified-rental mark.
          </p>
        </div>
      </form>
    </BottomSheet>
  )
}
