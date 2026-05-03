import { Link } from "react-router-dom"

import { DressingForPicker } from "@/components/sections/DressingForPicker"
import { Button } from "@/components/ui/button"
import { SAMPLE_DATA } from "@/dummy/sampleData"
import { cn } from "@/lib/utils"

const defaults = SAMPLE_DATA.HeroSection

type HeroSectionProps = {
  eyebrow?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
  secondaryCtaLabel?: string
  secondaryCtaTo?: string
  pickerCtaLabel?: string
  dressingFor?: boolean
}

export function HeroSection({
  eyebrow,
  title = defaults.title,
  description = defaults.description,
  ctaLabel = defaults.ctaLabel,
  ctaTo = "/shop",
  secondaryCtaLabel = defaults.ctaSecondaryLabel,
  secondaryCtaTo = defaults.ctaSecondaryTo,
  pickerCtaLabel,
  dressingFor = false,
}: HeroSectionProps = {}) {
  return (
    <section className="bg-white px-4 py-16 sm:py-20">
      <div className={dressingFor ? "mx-auto max-w-4xl text-center" : "mx-auto max-w-3xl text-center"}>
        {eyebrow ? (
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase sm:text-sm">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-3xl text-neutral-900 sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm tracking-tight text-black sm:text-base">{description}</p>

        <div
          className={cn(
            "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4",
          )}
        >
          <Button variant="pill" asChild className="h-auto min-w-[10rem] px-6 py-3 text-sm font-medium">
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-auto min-w-[10rem] rounded-full border-neutral-300 px-6 py-3 text-sm font-medium"
          >
            <Link to={secondaryCtaTo}>{secondaryCtaLabel}</Link>
          </Button>
        </div>

        {dressingFor ? <DressingForPicker ctaLabel={pickerCtaLabel} /> : null}
      </div>
    </section>
  )
}

export default HeroSection
