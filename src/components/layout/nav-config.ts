export const SITE_LOGO_TEXT = "SHOP SELAIR"

export const utilityLinks = {
  howItWorks: { label: "How it Works", href: "/#why-selair" },
} as const

export type CategoryItem =
  | { label: string; to: string; variant?: "default" }
  | { label: string; to: string; variant: "accent" }

export const categoryNavItems: CategoryItem[] = [
  { label: "Browse All", to: "/shop" },
  { label: "New Arrivals", to: "/#new-arrivals" },
  { label: "One-off Rentals", to: "/rent" },
  { label: "Dresses", to: "/shop" },
  { label: "Everyday", to: "/essentials" },
  { label: "Workwear", to: "/shop" },
  { label: "Vacations", to: "/rent" },
  { label: "Weddings", to: "/shop" },
  { label: "Designers", to: "/shop" },
  { label: "Maternity", to: "/shop" },
  { label: "Buy", to: "/shop" },
]
