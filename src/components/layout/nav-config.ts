export const SITE_LOGO_TEXT = "SHOP SELAIR"

export const utilityLinks = {
  howItWorks: { label: "How it Works", href: "/#why-selair" },
} as const

export type CategoryItem =
  | { label: string; to: string; variant?: "default" }
  | { label: string; to: string; variant: "accent" }

export const categoryNavItems: CategoryItem[] = [
  { label: "Browse All", to: "/shop" },
  { label: "New Arrivals", to: "/shop?filter=new-arrivals" },
  { label: "One-off Rentals", to: "/rent" },
  { label: "Dresses", to: "/shop?filter=dresses" },
  { label: "Everyday", to: "/essentials" },
  { label: "Workwear", to: "/shop?filter=workwear" },
  { label: "Vacations", to: "/rent" },
  { label: "Weddings", to: "/shop?filter=weddings" },
  { label: "Designers", to: "/shop?filter=designers" },
  { label: "Maternity", to: "/shop?filter=maternity" },
  { label: "Buy", to: "/shop?filter=buy" },
]
