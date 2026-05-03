import { HeroSection } from "@/components/sections/HeroSection"
import { NewArrival } from "@/components/sections/NewArrival"
import { SplitSection } from "@/components/sections/SplitSection"
import { WhyChoose } from "@/components/sections/WhyChoose"
import { FollowInstagram } from "@/components/sections/FollowInstagram"
import { FaqSection } from "@/components/sections/FaqSection"

export function HomePage() {
  return (
    <>
      <HeroSection
        dressingFor
        ctaLabel="Shop now"
        ctaTo="/shop"
        secondaryCtaLabel="Explore rentals"
        secondaryCtaTo="/rent"
        pickerCtaLabel="Browse All Styles"
      />

      <NewArrival />
      <SplitSection />
      <WhyChoose />
      <FaqSection />
      <FollowInstagram />
    </>
  )
}
