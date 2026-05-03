import { HeroSection } from "@/components/sections/HeroSection"

export function ShopPage() {
  return (
    <HeroSection
      eyebrow="Everyday shopping made simple"
      title="Shop Essentials With Ease"
      description="Discover practical items for school and home with fast checkout and reliable delivery options."
      ctaLabel="Browse Shop"
      ctaTo="/shop"
      secondaryCtaLabel="Rent formal wear"
      secondaryCtaTo="/rent"
    />
  )
}
