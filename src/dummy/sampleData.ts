/**
 * Marketing copy and placeholder art for the merchandised sections.
 *
 * Store catalog is loaded from the API. Every `image` below is a PLACEHOLDER
 * and should be replaced with Sselair's own photography before launch — the
 * URLs are only here so the layouts can be reviewed with real proportions.
 */

const PLACEHOLDER_A =
  "https://images.pexels.com/photos/17472389/pexels-photo-17472389.jpeg?auto=compress&cs=tinysrgb&w=1200"
const PLACEHOLDER_B =
  "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200"
const PLACEHOLDER_C =
  "https://images.pexels.com/photos/13868107/pexels-photo-13868107.jpeg?auto=compress&cs=tinysrgb&w=1200"

export type HeroSlide = {
  id: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaTo: string
  /** Wide panel, carries the overlay copy. */
  image: string
  /** Narrow companion panel shown from `lg` up. */
  sideImage: string
  imageAlt: string
  sideImageAlt: string
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "filipiniana",
    title: "Filipiniana for the whole occasion",
    subtitle: "Modern ternos, classic cuts and barong — reserved by the date.",
    ctaLabel: "Browse Pieces",
    ctaTo: "/shop",
    image: PLACEHOLDER_A,
    sideImage: PLACEHOLDER_B,
    imageAlt: "Modern Filipiniana dress styled for an evening programme",
    sideImageAlt: "Guest wearing a barong at an outdoor celebration",
  },
  {
    id: "barong",
    title: "Barong Tagalog, fitted before you wear it",
    subtitle: "Piña, jusi and organza for grooms, ninongs and the entourage.",
    ctaLabel: "Shop Barong",
    ctaTo: "/shop?filter=barong",
    image: PLACEHOLDER_B,
    sideImage: PLACEHOLDER_C,
    imageAlt: "Barong Tagalog detail shot",
    sideImageAlt: "Entourage in coordinated Filipiniana",
  },
  {
    id: "kids",
    title: "Little ones, dressed for the programme",
    subtitle: "Kids' formal and sparkly pieces, sized for the day itself.",
    ctaLabel: "Shop Kids",
    ctaTo: "/shop?filter=kids",
    image: PLACEHOLDER_C,
    sideImage: PLACEHOLDER_A,
    imageAlt: "Child in formal Filipiniana attire",
    sideImageAlt: "Family portrait in coordinated formal wear",
  },
]

/** The wide statement line that sits directly under the hero. */
export const STATEMENT_LINE =
  "Sselair dresses the whole occasion. Modern and classic Filipiniana, Barong Tagalog, boleros, pearls and kids' formal — rented, styled and fitted across the Philippines."

/** Editorial tiles under the statement line. */
export const EDITORIAL_TILES = [
  {
    id: "weddings",
    label: "For the entourage",
    ctaLabel: "Shop weddings",
    to: "/shop?occasion=wedding",
    image: PLACEHOLDER_A,
    alt: "Wedding entourage in Filipiniana",
  },
  {
    id: "debut",
    label: "Debut & 18th",
    ctaLabel: "Shop debut",
    to: "/shop?occasion=debut",
    image: PLACEHOLDER_B,
    alt: "Debutante in a modern terno",
  },
  {
    id: "graduation",
    label: "Graduation & recognition",
    ctaLabel: "Shop graduation",
    to: "/shop?occasion=graduation",
    image: PLACEHOLDER_C,
    alt: "Graduate in Filipiniana",
  },
] as const

/** Split card beneath the plan module. */
export const PERKS_PANEL = {
  title: "More from Sselair",
  image: PLACEHOLDER_C,
  imageAlt: "Filipiniana pieces laid out for a fitting",
  items: [
    {
      title: "Styling that comes with the piece",
      body: "Tell us the occasion and dress code. We suggest boleros, overskirts, pearls and brooches that work with what you picked.",
    },
    {
      title: "Fittings before your date",
      body: "Book a fitting so alterations and pinning are sorted well before the event, not on the morning of it.",
    },
    {
      title: "Cleaning handled on our side",
      body: "Send the piece back as it was worn. Professional cleaning is ours to take care of.",
    },
  ],
} as const

/** Kept for the rent/essentials hero variants. */
export const SAMPLE_DATA = {
  HeroSection: {
    title: HERO_SLIDES[0].title,
    description: HERO_SLIDES[0].subtitle,
    ctaLabel: HERO_SLIDES[0].ctaLabel,
    ctaSecondaryLabel: "How it works",
    ctaSecondaryTo: "/#how-it-works",
    sideImageLeft: PLACEHOLDER_A,
    sideImageRight: PLACEHOLDER_B,
  },

  ClothingRental: {
    title: "Rented, not retired",
    description:
      "Filipiniana is worn a handful of times and kept for decades. Renting puts these pieces back into circulation — and keeps a wardrobe from filling up with outfits worn once.",
    ctaLabel: "Explore rentals",
    image: PLACEHOLDER_B,
  },
}
