import { useMemo } from "react"
import DOMPurify from "dompurify"

import { cn } from "@/lib/utils"

/**
 * Tags the shop's own description may use.
 *
 * It is written in the admin's editor, whose schema already limits it to this
 * set — but the storefront is a public page rendering markup that arrived over
 * the wire, so it checks for itself rather than trusting the other end. An
 * allowlist, not a blocklist: anything not named here is stripped.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "h3",
  "a",
]

const ALLOWED_ATTR = ["href", "target", "rel"]

/**
 * The shop's own words about a piece.
 *
 * Distinct from the bulleted "details", which are facts about fabric and fit:
 * this is the paragraph a stylist writes about how a piece wears and where it
 * belongs. It sits directly above the reviews, so the page reads as the shop's
 * account of the piece followed by everyone else's.
 */
export function ProductDescription({
  html,
  className,
}: {
  html: string | null | undefined
  className?: string
}) {
  const clean = useMemo(() => {
    if (!html) return ""
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      /* Links open elsewhere, so they must not hand the opener a window ref. */
      ADD_ATTR: ["rel"],
    })
  }, [html])

  /* An empty or markup-only description is no description at all. */
  if (!clean.replace(/<[^>]*>/g, "").trim()) return null

  return (
    <section
      aria-labelledby="description-heading"
      className={cn("border-t border-line py-12 sm:py-16", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="description-heading"
          className="font-heading text-2xl font-medium text-ink sm:text-3xl"
        >
          Piece description
        </h2>

        <div
          className={cn(
            "mt-5 text-base leading-relaxed text-ink-soft",
            "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
            "[&_strong]:font-semibold [&_strong]:text-ink",
            "[&_em]:italic [&_s]:line-through [&_u]:underline",
            "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5",
            "[&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-ink [&_h3:first-child]:mt-0",
            "[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4"
          )}
          /* Sanitised immediately above, with an allowlist. */
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  )
}
