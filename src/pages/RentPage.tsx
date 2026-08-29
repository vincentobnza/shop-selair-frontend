import { Helmet } from "react-helmet-async"
import { FaqSection } from "@/components/sections/FaqSection"
import { HeroSection } from "@/components/sections/HeroSection"
import { OccasionPicker } from "@/components/sections/OccasionPicker"
import { PlanSection } from "@/components/sections/PlanSection"
import { buildTitle, DEFAULT_DESCRIPTION } from "@/config/site"
export function RentPage() {
  return (
    <main className="bg-paper">
      <Helmet>
        <title>{buildTitle("Rent Filipiniana")}</title>{" "}
        <meta name="description" content={DEFAULT_DESCRIPTION} />
      </Helmet>

      <HeroSection />
      <OccasionPicker />
      <PlanSection />
      <FaqSection />
    </main>
  )
}
