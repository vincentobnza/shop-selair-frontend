import type { ComponentType } from "react"
import { Link } from "react-router-dom"
import {
  BabyIcon,
  BriefcaseIcon,
  ConfettiIcon,
  GraduationCapIcon,
  HeartStraightIcon,
  SparkleIcon,
  type IconProps,
} from "@phosphor-icons/react"
import { OCCASIONS, type OccasionId } from "@/config/brand"

const ICONS: Record<OccasionId, ComponentType<IconProps>> = {
  wedding: HeartStraightIcon,
  debut: SparkleIcon,
  graduation: GraduationCapIcon,
  fiesta: ConfettiIcon,
  corporate: BriefcaseIcon,
  christening: BabyIcon,
}

/**
 * Occasion shortcuts. Filipiniana is bought into by event, not by silhouette,
 * so this is usually the first cut a visitor wants to make.
 */
export function OccasionPicker() {
  return (
    <section aria-labelledby="occasion-heading" className="bg-pink-light">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h2
          id="occasion-heading"
          className="text-center font-heading text-2xl font-medium text-ink sm:text-3xl"
        >
          What are you dressing for?
        </h2>

        <ul className="mt-8 flex flex-wrap items-start justify-center gap-x-4 gap-y-6 sm:gap-x-10">
          {OCCASIONS.map((occasion) => {
            const Icon = ICONS[occasion.id]
            return (
              <li key={occasion.id}>
                <Link
                  to={`/shop?occasion=${occasion.id}`}
                  className="group flex w-20 touch-manipulation flex-col items-center gap-3 text-center sm:w-24"
                >
                  <span className="flex size-14 items-center justify-center rounded-full border border-black bg-transparent text-ink transition-colors group-hover:bg-brand group-hover:text-white sm:size-16">
                    <Icon size={26} weight="light" />
                  </span>
                  <span className="text-base font-semibold text-ink">
                    {occasion.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default OccasionPicker
