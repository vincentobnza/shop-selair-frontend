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
  sideImageLeft?: string
  sideImageRight?: string
}

function SideImage({ src }: { src: string }) {
  return (
    <div className="h-[min(70vh,34rem)] w-full min-w-0 overflow-hidden rounded bg-neutral-100 xl:h-[min(75vh,38rem)]">
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  )
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
  sideImageLeft = defaults.sideImageLeft,
  sideImageRight = defaults.sideImageRight,
}: HeroSectionProps = {}) {
  const showSides = Boolean(sideImageLeft && sideImageRight)

  const mainCopy = (
    <>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-heading mx-auto max-w-3xl text-[1.75rem] leading-snug text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3.5rem] xl:leading-tight">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black sm:text-base">
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
          className="h-11 w-full px-6 text-sm font-medium touch-manipulation sm:h-auto sm:min-w-40 sm:w-auto sm:py-3"
        >
          <Link to={ctaTo}>{ctaLabel}</Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-11 w-full rounded-full  px-6 text-sm font-medium touch-manipulation sm:h-auto sm:min-w-40 sm:w-auto sm:py-3"
        >
          <Link to={secondaryCtaTo}>{secondaryCtaLabel}</Link>
        </Button>
      </div>
    </>
  )

  return (
    <section className="bg-white px-4 py-14 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="mx-auto max-w-screen-2xl">
        {showSides ? (
          <div className="flex flex-col gap-12 lg:gap-16">
            <div
              className={cn(
                "grid gap-8 lg:items-center lg:gap-10 xl:gap-14",
                dressingFor
                  ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,min(44rem,100%))_minmax(0,1fr)]"
                  : "lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)_minmax(0,1fr)]",
              )}
            >
              <div className="hidden min-w-0 lg:block">
                <SideImage src={sideImageLeft} />
              </div>

              <div className="min-w-0 text-center">{mainCopy}</div>

              <div className="hidden min-w-0 lg:block">
                <SideImage src={sideImageRight} />
              </div>
            </div>

            {dressingFor ? (
              <div className="mx-auto w-full max-w-5xl">
                <DressingForPicker ctaLabel={pickerCtaLabel} />
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className={cn(
              "text-center",
              dressingFor ? "mx-auto max-w-4xl" : "mx-auto max-w-3xl",
            )}
          >
            {mainCopy}
            {dressingFor ? (
              <DressingForPicker ctaLabel={pickerCtaLabel} />
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection
