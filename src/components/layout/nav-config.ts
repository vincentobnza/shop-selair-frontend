import {
  SHOP_FILTER_OPTIONS,
  shopFilterHref,
} from "@/components/shop/shop-filters"

export const SITE_LOGO_TEXT = "SHOP SELAIR"

export const utilityLinks = {
  howItWorks: { label: "How it Works", href: "/#why-selair" },
} as const

export type CategoryItem =
  | { label: string; to: string; variant?: "default" }
  | { label: string; to: string; variant: "accent" }

export const categoryNavItems: CategoryItem[] = SHOP_FILTER_OPTIONS.map(
  (o) => ({
    label: o.label,
    to: shopFilterHref(o.id),
  }),
)
