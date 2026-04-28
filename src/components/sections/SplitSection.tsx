import { SAMPLE_DATA } from "@/dummy/sampleData"
import { Button } from "@/components/ui/button"

type SplitSectionProps = {
  title?: string
  description?: string
  ctaLabel?: string
  image?: string
}

export function SplitSection({
  title = SAMPLE_DATA.ClothingRental.title,
  description = SAMPLE_DATA.ClothingRental.description,
  ctaLabel = SAMPLE_DATA.ClothingRental.ctaLabel,
  image = SAMPLE_DATA.ClothingRental.image,
}: SplitSectionProps) {
  return (
    <section id="rent" className="overflow-hidden bg-[#1f1c19]">
      <div className="mx-auto flex max-w-6xl flex-col-reverse gap-8 px-4 py-12 sm:flex-row sm:items-center sm:gap-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="sm:w-1/2">
          <h2 className="mb-4 font-heading text-3xl leading-tight text-white sm:mb-6 sm:text-5xl lg:text-6xl">
            {title}
          </h2>

          <p className="mb-6 max-w-lg text-sm text-white/80 sm:mb-8 sm:text-base lg:text-lg">
            {description}
          </p>

          <div>
            <Button className="h-11 rounded border border-white/90 bg-transparent px-6 text-sm text-white hover:bg-white hover:text-[#0b0b0b]">
              {ctaLabel}
            </Button>
          </div>
        </div>

        <div className="sm:w-1/2">
          <img src={image} alt={title} className="block h-auto w-full" />
        </div>
      </div>
    </section>
  )
}
