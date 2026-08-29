import { AppImage } from "@/components/ui/app-image"
import { PERKS_PANEL } from "@/dummy/sampleData"

/**
 * Two-up card: soft image panel on the left, a short list of what the service
 * includes on the right. Mirrors the perks card in the reference home page.
 */
export function SplitSection() {
  return (
    <section id="fittings" className="bg-paper">
      <div className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid overflow-hidden rounded-sm bg-white sm:grid-cols-2">
          <div className="bg-pink">
            <AppImage
              src={PERKS_PANEL.image}
              alt={PERKS_PANEL.imageAlt}
              className="h-56 w-full object-cover sm:h-full sm:min-h-80"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-10">
            <h2 className="font-heading text-2xl font-medium text-ink sm:text-3xl">
              {PERKS_PANEL.title}
            </h2>
            <dl className="grid gap-4">
              {PERKS_PANEL.items.map((item) => (
                <div key={item.title}>
                  <dt className="text-base font-semibold text-ink">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-base leading-relaxed text-ink-soft">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SplitSection
