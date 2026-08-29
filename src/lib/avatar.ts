/**
 * Default profile pictures, from DiceBear's `initial-face` style.
 *
 * The style only exists on DiceBear's hosted API (10.x) — the npm collection is
 * still on 9.x and 404s for it — so these are `<img>` requests to a third
 * party rather than SVGs generated in-process.
 *
 * That makes the seed a privacy decision, not a cosmetic one: whatever we put
 * in it is sent to api.dicebear.com on every render. So the seed is the user's
 * **id**, never their name or email. A UUID is opaque, stable for the life of
 * the account, and still gives each person their own face. Seeding with an
 * email would hand our customer list to a CDN one avatar at a time.
 *
 * Callers always render initials underneath — see `UserAvatar` — so a blocked,
 * offline, or slow CDN degrades to a letter rather than a hole in the layout.
 */
const DICEBEAR_ENDPOINT = "https://api.dicebear.com/10.x/initial-face/svg"

/** Soft tints drawn from the shop's own palette, so faces sit in the theme. */
const BACKGROUNDS = ["fbedec", "f3d2cd", "e8e2dd", "dfe7e3", "e6e0ef"]

/**
 * A stable avatar URL for one account.
 *
 * `seed` must be an opaque id. Returns null when there is no id yet — the
 * caller then shows initials alone rather than requesting a face for "".
 */
export function avatarUrl(seed: string | null | undefined): string | null {
  if (!seed) {
    return null
  }

  const params = new URLSearchParams({
    seed,
    radius: "50",
    backgroundType: "gradientLinear",
  })

  /*
   * Each tint is its own `backgroundColor` parameter. Joining them with a
   * comma looks equivalent but is not: URLSearchParams percent-encodes the
   * comma, and the API then reads one malformed colour instead of a list and
   * rejects the request with a 400.
   */
  for (const colour of BACKGROUNDS) {
    params.append("backgroundColor", colour)
  }

  return `${DICEBEAR_ENDPOINT}?${params.toString()}`
}

/** Two letters from a name — the fallback, and what shows before the image lands. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
