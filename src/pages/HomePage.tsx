import { HeroSection } from "@/components/sections/HeroSection"
import { NewArrival } from "@/components/sections/NewArrival"
import { SplitSection } from "@/components/sections/SplitSection"
import { WhyChoose } from "@/components/sections/WhyChoose"
import { FollowInstagram } from "@/components/sections/FollowInstagram"
import { SAMPLE_DATA } from "@/dummy/sampleData"

export function HomePage() {
  return (
    <>
      <HeroSection
        title={SAMPLE_DATA.HeroSection.title}
        description={SAMPLE_DATA.HeroSection.description}
        ctaLabel={SAMPLE_DATA.HeroSection.ctaLabel}
        backgroundImage={SAMPLE_DATA.HeroSection.heroBackgroundImage}
      />

      <NewArrival />
      <SplitSection />
      <WhyChoose />
      <FollowInstagram />
    </>
  )
}
