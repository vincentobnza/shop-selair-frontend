import { HeroSection } from "@/components/sections/HeroSection"
import { NewArrival } from "@/components/sections/NewArrival"
import { SplitSection } from "@/components/sections/SplitSection"
import { WhyChoose } from "@/components/sections/WhyChoose"
import { FollowInstagram } from "@/components/sections/FollowInstagram"
import { FaqSection } from "@/components/sections/FaqSection"

export default function HomePageBody() {
  return (
    <>
      <HeroSection />
      <NewArrival />
      <SplitSection />
      <WhyChoose />
      <FaqSection />
      <FollowInstagram />
    </>
  )
}
