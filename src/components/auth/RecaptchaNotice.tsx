import { isRecaptchaEnabled } from "@/lib/recaptcha"

/**
 * The attribution Google's terms require whenever the reCAPTCHA badge is
 * hidden.
 *
 * The badge is a floating box pinned to the bottom-right of the viewport; on
 * the split auth layout it sits over the photograph, and on mobile it covers
 * the submit button. Google explicitly permits hiding it *provided* the
 * branding appears in the user flow instead — so this line is not decoration,
 * it is the condition on which `.grecaptcha-badge { visibility: hidden }` in
 * index.css is allowed. Remove one and you must remove the other.
 *
 * Renders nothing when reCAPTCHA is not configured, so a local build without a
 * site key does not claim protection it does not have.
 */
export function RecaptchaNotice({ className = "" }: { className?: string }) {
  if (!isRecaptchaEnabled()) return null

  return (
    <p className={`text-sm leading-relaxed text-ink-soft ${className}`}>
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:text-ink"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:text-ink"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  )
}
