/**
 * Business facts for Sselair — single source of truth for anything a visitor
 * reads as a claim about the shop (name, what we rent, where to reach us).
 *
 * Keep this file conservative: only add details that are publicly confirmed on
 * the shop's own channels. Marketing copy may be written around these values,
 * but the values themselves should never be invented.
 */

export const BRAND = {
  name: "Sselair",
  /** Wordmark rendering — kept apart from `name` so casing can differ. */
  wordmark: "SSELAIR",
  tagline: "Filipiniana, rented and styled",
  /** One-line positioning used in hero copy, SEO and share cards. */
  positioning:
    "A Philippine rental and styling house for modern and classic Filipiniana, Barong Tagalog, and kids' formal wear.",
  country: "Philippines",
  currency: "PHP",
  locale: "en-PH",
} as const

export const SOCIALS = {
  facebook: {
    label: "Facebook",
    handle: "shopsselair",
    href: "https://www.facebook.com/shopsselair/",
  },
  instagram: {
    label: "Instagram",
    handle: "shop.selair",
    href: "https://instagram.com/shop.selair",
  },
} as const

/** Primary way customers reach the shop today. */
export const PRIMARY_CONTACT = {
  label: "Message us on Facebook",
  href: SOCIALS.facebook.href,
} as const

/**
 * What Sselair actually rents. Drives the category nav, the shop filters and
 * the home page collection rail, so the three can never drift apart.
 */
export const COLLECTIONS = [
  {
    id: "modern-filipiniana",
    label: "Modern Filipiniana",
    blurb: "Contemporary silhouettes with butterfly sleeves and clean lines.",
    tags: ["modern-filipiniana", "filipiniana", "modern", "dress"],
  },
  {
    id: "classic-filipiniana",
    label: "Classic Filipiniana",
    blurb: "Traditional terno and Maria Clara cuts for formal programs.",
    tags: ["classic-filipiniana", "terno", "maria-clara", "traditional"],
  },
  {
    id: "barong",
    label: "Barong Tagalog",
    blurb: "Piña, jusi and organza barong for grooms, ninongs and guests.",
    tags: ["barong", "barong-tagalog", "mens", "men"],
  },
  {
    id: "boleros",
    label: "Boleros & Separates",
    blurb: "Mix-and-match boleros, overskirts and tops to restyle a look.",
    tags: ["bolero", "boleros", "separates", "top", "skirt"],
  },
  {
    id: "kids",
    label: "Kids' Formal",
    blurb: "Sparkly and formal pieces cut for little wearers.",
    tags: ["kids", "kids-formal", "children", "girls", "boys"],
  },
  {
    id: "accessories",
    label: "Accessories",
    blurb: "Pearls, brooches and finishing pieces that complete the set.",
    tags: ["accessories", "pearls", "brooch", "brooches", "jewelry"],
  },
] as const

export type CollectionId = (typeof COLLECTIONS)[number]["id"]

/** Occasions Filipiniana is worn for in the Philippines, used by the picker. */
export const OCCASIONS = [
  { id: "wedding", label: "Wedding", tags: ["wedding", "weddings"] },
  { id: "debut", label: "Debut", tags: ["debut", "18th"] },
  { id: "graduation", label: "Graduation", tags: ["graduation", "grad"] },
  {
    id: "fiesta",
    label: "Fiesta",
    tags: ["fiesta", "buwan-ng-wika", "festival"],
  },
  {
    id: "corporate",
    label: "Corporate",
    tags: ["corporate", "office", "work"],
  },
  { id: "christening", label: "Christening", tags: ["christening", "baptism"] },
] as const

export type OccasionId = (typeof OCCASIONS)[number]["id"]

/** The three promises repeated across home, PDP and FAQ. Keep them truthful. */
export const SERVICE_PROMISES = [
  {
    title: "Reserve your dates",
    body: "Pick your piece and block the days you need it. We hold it for your event, not just for a shipping window.",
  },
  {
    title: "Fit and style it",
    body: "Book a fitting or tell us your measurements. We suggest boleros, pearls and brooches that finish the look.",
  },
  {
    title: "Wear it, send it back",
    body: "Return it on your end date in the packaging it arrived in. Professional cleaning is handled on our side.",
  },
] as const

/**
 * Headline numbers shown in the plan module.
 *
 * PLACEHOLDER VALUES — these are commercial claims. Confirm each one with the
 * shop before launch and update here; every surface reads from this array, so
 * there is exactly one place to change.
 */
export const PLAN_HIGHLIGHTS = [
  { value: "3", label: "Day rental" },
  { value: "1", label: "Free fitting" },
  { value: "0", label: "Cleaning fees" },
] as const

/**
 * Plan detail rows in the module accordion. Wording is deliberately
 * non-committal on figures that have not been confirmed by the shop.
 */
export const PLAN_DETAILS = [
  {
    q: "Reserve by the date, not by the month",
    a: "You choose the days you need the piece. We hold it for that window so it is with you before the event and not booked out from under you.",
  },
  {
    q: "Fittings and alterations",
    a: "Book a fitting and we handle pinning and adjustments beforehand. Message us if you are outside Metro Manila and we will work from your measurements.",
  },
  {
    q: "Sizes across the family",
    a: "Modern and classic Filipiniana, barong for men, and kids' formal — so one occasion can be dressed from a single booking.",
  },
  {
    q: "Cleaning is on us",
    a: "Return the piece as it was worn. Professional cleaning is part of the rental, not an extra line on your bill.",
  },
  {
    q: "Accessories to finish the look",
    a: "Pearls, brooches and boleros can be added to a booking so the set arrives together.",
  },
  {
    q: "Damage and late returns",
    a: "Normal wear is expected and covered. Significant damage or a late return may carry a charge — the terms are confirmed with you at booking.",
  },
] as const
