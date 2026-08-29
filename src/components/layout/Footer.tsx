import { useId, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import {
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { BRAND, PRIMARY_CONTACT, SOCIALS } from "@/config/brand"
import { shopFilterHref } from "@/components/shop/shop-filters"

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "All pieces", to: "/shop" },
      { label: "Modern Filipiniana", to: shopFilterHref("modern-filipiniana") },
      { label: "Barong Tagalog", to: shopFilterHref("barong") },
      { label: "Kids' formal", to: shopFilterHref("kids") },
      { label: "Accessories", to: shopFilterHref("accessories") },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "How it works", to: "/#how-it-works" },
      { label: "Fittings", to: "/#fittings" },
      { label: "FAQs", to: "/#faq" },
      { label: "My orders", to: "/account/orders" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our story", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Favorites", to: "/favorites" },
    ],
  },
] as const

const SOCIAL_LINKS = [
  { ...SOCIALS.facebook, Icon: FacebookLogoIcon },
  { ...SOCIALS.instagram, Icon: InstagramLogoIcon },
] as const

/**
 * Newsletter capture band.
 *
 * The submit handler is intentionally a local acknowledgement only — there is
 * no subscriber endpoint wired up yet. Point `onSubmit` at the real mutation
 * before shipping so a visitor is never told they signed up when they have not.
 */
function NewsletterBand() {
  const emailId = useId()
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-light text-ink">
            <EnvelopeSimpleIcon size={18} />
          </span>
          <div>
            <p className="text-base font-semibold text-ink">
              {BRAND.name} letters
            </p>
            <p className="text-base text-ink-soft">
              New arrivals and open fitting dates, a few times a season.
            </p>
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Email*"
              className="h-11 w-full border-0 border-b border-ink/25 bg-transparent px-1 text-base text-ink outline-none placeholder:text-ink-soft focus:border-brand"
            />
          </div>
          <Button
            type="submit"
            variant="pill"
            className="h-11 px-8 text-base font-semibold"
          >
            Submit
          </Button>
        </form>
      </div>
      {submitted ? (
        <p
          role="status"
          className="px-4 pb-6 text-center text-base text-ink-soft sm:px-6 lg:px-8"
        >
          Thanks — we will be in touch when the next pieces land.
        </p>
      ) : null}
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white">
      <NewsletterBand />

      <div className="scallop-top bg-pink-light pt-10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] lg:px-8">
          <div>
            <Link
              to="/"
              className="font-logo text-2xl leading-none font-bold tracking-[-0.04em] text-ink"
            >
              {BRAND.wordmark.toLowerCase()}
            </Link>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-ink-soft">
              {BRAND.positioning}
            </p>

            <ul className="mt-6 flex gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} — opens in a new tab`}
                    className="flex size-9 items-center justify-center rounded-md bg-brand text-white transition-opacity hover:opacity-85"
                  >
                    <Icon size={18} weight="fill" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-base font-semibold text-ink">
                {col.heading}
              </h2>{" "}
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-base text-brand underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        {/* Decorative keyline strip, mirroring the reference footer. */}
        <div
          aria-hidden
          className="flex overflow-hidden bg-pink py-2 select-none"
        >
          <p className="text-base font-bold whitespace-nowrap text-white/85">
            {`${BRAND.wordmark.toLowerCase()} `.repeat(40)}
          </p>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-base text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link to="/terms" className="hover:text-brand">
              Terms
            </Link>
            <span aria-hidden>|</span>
            <Link to="/privacy" className="hover:text-brand">
              Privacy
            </Link>
            <span aria-hidden>|</span>
            <a
              href={PRIMARY_CONTACT.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              {PRIMARY_CONTACT.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
