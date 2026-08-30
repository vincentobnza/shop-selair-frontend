import { FacebookLogoIcon, InstagramLogoIcon } from "@phosphor-icons/react"
import { BRAND, SOCIALS } from "@/config/brand"

const CHANNELS = [
  { ...SOCIALS.facebook, Icon: FacebookLogoIcon },
  { ...SOCIALS.instagram, Icon: InstagramLogoIcon },
] as const

/**
 * Social band. Fittings, new arrivals and booked-out dates are announced on the
 * shop's own pages, so this points there rather than duplicating a feed.
 */
export function FollowInstagram() {
  return (
    <section id="follow-us" className="border-t border-border bg-paper">
      <div className="mx-auto max-w-4xl px-4 pb-16 text-center sm:px-6 sm:pb-20 lg:px-8">
        <div className="rounded-sm bg-pink-light px-6 py-12 sm:px-10">
          <p className="eyebrow">Stay close</p>{" "}
          <h2 className="mt-3 font-heading text-2xl font-medium text-ink sm:text-3xl">
            New pieces land on our pages first
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base text-ink-soft">
            Fitting slots, fresh arrivals and what is already booked for the
            season — posted as it happens.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {CHANNELS.map(({ label, handle, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black bg-white px-5 text-base font-medium text-ink transition-colors hover:bg-brand hover:text-white"
              >
                <Icon size={18} weight="fill" />
                {handle}
                <span className="sr-only">{label} — opens in a new tab</span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-base text-ink-soft">
            {BRAND.name} ships and styles across the {BRAND.country}.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FollowInstagram
