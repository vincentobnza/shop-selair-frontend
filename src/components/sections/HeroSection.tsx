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
    <section className="bg-white px-4 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
      <div className={dressingFor ? "mx-auto max-w-4xl text-center" : "mx-auto max-w-3xl text-center"}>
        {eyebrow ? (
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase sm:text-sm">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-[1.65rem] leading-snug text-neutral-900 sm:text-4xl md:text-5xl max-w-3xl mx-auto">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed tracking-tight text-black sm:text-base">
          {description}
        </p>

        <div
          className={cn(
            "mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4",
          )}
        >
          <Button
            variant="pill"
            asChild
            className="h-11 w-full px-6 text-sm font-medium touch-manipulation sm:h-auto sm:min-w-[10rem] sm:w-auto sm:py-3"
          >
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-11 w-full rounded-full border-neutral-300 px-6 text-sm font-medium touch-manipulation sm:h-auto sm:min-w-[10rem] sm:w-auto sm:py-3"
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
