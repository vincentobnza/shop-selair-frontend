import { CollectionRail } from "@/components/sections/CollectionRail"
import { CustomerReviews } from "@/components/sections/CustomerReviews"
import { EditorialTiles } from "@/components/sections/EditorialTiles"
import { FaqSection } from "@/components/sections/FaqSection"
import { FollowInstagram } from "@/components/sections/FollowInstagram"
import { HeroSection } from "@/components/sections/HeroSection"
import { OccasionPicker } from "@/components/sections/OccasionPicker"
import { PlanSection } from "@/components/sections/PlanSection"
import { SplitSection } from "@/components/sections/SplitSection"
import { StatementBand } from "@/components/sections/StatementBand"
export default function HomePageBody() {
  return (
    <>
      <HeroSection />
      <StatementBand />
      <EditorialTiles />
      <CollectionRail />
      <OccasionPicker />
      <PlanSection />
      <SplitSection />
      <FaqSection />
      <CustomerReviews />
      <FollowInstagram />
    </>
  )
}
