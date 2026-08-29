import { BRAND, COLLECTIONS, OCCASIONS } from "@/config/brand"
import { shopFilterHref } from "@/components/shop/shop-filters"

export const SITE_LOGO_TEXT = BRAND.wordmark

/** Right-hand utility links in the header, mirroring the reference layout. */
export const utilityLinks = {
  howItWorks: { label: "How It Works", href: "/#how-it-works" },
  explore: { label: "Explore", href: "/shop" },
  fittings: { label: "Fittings", href: "/#fittings" },
} as const

export type CategoryItem = {
  label: string
  to: string
  variant?: "default" | "accent"
}

/** Collections, used by the Browse panel and the mobile menu. */
export const categoryNavItems: CategoryItem[] = COLLECTIONS.map((c) => ({
  label: c.label,
  to: shopFilterHref(c.id),
}))

/** Occasion shortcuts shown alongside collections in the Browse panel. */
export const occasionNavItems: CategoryItem[] = OCCASIONS.map((o) => ({
  label: o.label,
  to: `/shop?occasion=${o.id}`,
}))
