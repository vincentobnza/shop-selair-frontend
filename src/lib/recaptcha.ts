/**
 * Google reCAPTCHA v3 — the browser half.
 *
 * v3 never interrupts anyone: it watches the session and mints a token the API
 * exchanges for a score. Two properties of that token drive every decision in
 * this file.
 *
 * 1. **It expires in about two minutes and may be spent once.** So a token is
 *    minted at submit time, never on mount. Minting on mount is the classic
 *    version of this bug — it works for whoever tests it immediately and fails
 *    for the customer who pauses to find their password, with the API
 *    reporting the unhelpful `timeout-or-duplicate`.
 * 2. **The script is ~150KB and phones home.** So it loads on the auth screens
 *    that need it rather than site-wide. `preload` warms it on mount; `execute`
 *    awaits the same cached promise, so a fast submit still works.
 *
 * Mirrors src/lib/recaptcha.ts in the admin console.
 */

/** Longest we wait for Google's script before giving up on it. */
const SCRIPT_TIMEOUT_MS = 10_000
const SCRIPT_ID = "google-recaptcha-v3"

type Grecaptcha = {
  ready: (cb: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

/**
 * The reCAPTCHA script could not be loaded or run.
 *
 * Distinct from a *failed* check, which only the API can determine. This is
 * almost always an ad or script blocker, a corporate proxy, or an offline
 * browser — all of which the visitor can act on, given a message that says so.
 */
export class RecaptchaUnavailableError extends Error {
  constructor(message = "recaptcha unavailable") {
    super(message)
    this.name = "RecaptchaUnavailableError"
  }
}

/** Public site key. Safe to ship to the browser — that is what it is for. */
export function getRecaptchaSiteKey(): string {
  const raw = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  return typeof raw === "string" ? raw.trim() : ""
}

/**
 * Whether the app should send a token at all.
 *
 * Must match `RECAPTCHA_SECRET_KEY` being set on the API. Configuring one side
 * without the other is the only way to break sign-in with this feature:
 * key here but not there wastes a round trip; there but not here refuses
 * every request for want of a token.
 */
export function isRecaptchaEnabled(): boolean {
  return getRecaptchaSiteKey() !== ""
}

let loader: Promise<Grecaptcha> | null = null

/** Injects the script once per page load and resolves when the API is ready. */
function load(siteKey: string): Promise<Grecaptcha> {
  if (loader) return loader

  loader = new Promise<Grecaptcha>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new RecaptchaUnavailableError("no document"))
      return
    }

    let settled = false
    const finish = (fn: () => void) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      fn()
    }

    /*
     * A blocked request can hang rather than fire onerror, and the submit
     * button is disabled while this is pending — without a ceiling the form
     * would spin forever.
     */
    const timer = window.setTimeout(() => {
      finish(() => reject(new RecaptchaUnavailableError("script load timed out")))
    }, SCRIPT_TIMEOUT_MS)

    const onReady = () => {
      const api = window.grecaptcha
      if (!api) {
        finish(() => reject(new RecaptchaUnavailableError("script loaded without grecaptcha")))
        return
      }
      // `ready` fires once the internal API is usable, which is later than load.
      api.ready(() => finish(() => resolve(api)))
    }

    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      // Re-mount under HMR, or a second auth page in the same session.
      if (window.grecaptcha) onReady()
      else {
        existing.addEventListener("load", onReady, { once: true })
        existing.addEventListener(
          "error",
          () => finish(() => reject(new RecaptchaUnavailableError("script failed to load"))),
          { once: true }
        )
      }
      return
    }

    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.addEventListener("load", onReady, { once: true })
    script.addEventListener(
      "error",
      () => finish(() => reject(new RecaptchaUnavailableError("script failed to load"))),
      { once: true }
    )
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    // Let a later attempt retry rather than caching the failure forever — the
    // visitor may have switched off their blocker after reading the message.
    loader = null
    throw error
  })

  return loader
}

/**
 * Start fetching the script so it is warm by the time the form is submitted.
 * Safe to call repeatedly; failures are deliberately swallowed, because a
 * warm-up is not the moment to tell anyone anything.
 */
export function preloadRecaptcha(): void {
  const siteKey = getRecaptchaSiteKey()
  if (siteKey === "") return
  void load(siteKey).catch(() => undefined)
}

/**
 * Mint a token for `action`, at the moment of submission.
 *
 * The action must match the `@RecaptchaAction(...)` on the API route, which is
 * what stops a token minted on one form being spent on another.
 *
 * @returns the token, or `null` when reCAPTCHA is not configured for this build
 *          (local development), in which case the API is not checking either.
 * @throws {RecaptchaUnavailableError} when it is configured but cannot run.
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = getRecaptchaSiteKey()
  if (siteKey === "") return null

  const api = await load(siteKey)
  const token = await api.execute(siteKey, { action })

  if (typeof token !== "string" || token === "") {
    throw new RecaptchaUnavailableError("grecaptcha returned no token")
  }
  return token
}
