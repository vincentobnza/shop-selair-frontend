import { RecaptchaUnavailableError } from "@/lib/recaptcha"

type LaravelErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

export function toUserMessage(error: unknown): string {
  /*
   * The security check could not run in this browser — nothing reached the
   * API. Naming the usual cause is the difference between a visitor fixing it
   * in ten seconds and one who cannot sign in at all.
   */
  if (error instanceof RecaptchaUnavailableError) {
    return "We could not complete the security check. If you use an ad or script blocker, allow google.com for this site and try again."
  }
  if (error instanceof ApiError) {
    const msgs = error.flatMessages()
    return msgs[0] ?? "Something went wrong."
  }
  return "Network error. Is the API running?"
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`)
    this.status = status
    this.body = body
  }

  /** First-line summary for inline forms */
  flatMessages(): string[] {
    const b = this.body as LaravelErrorBody
    if (b?.errors && typeof b.errors === "object") {
      return Object.values(b.errors).flat().filter(Boolean)
    }
    if (typeof b?.message === "string") {
      return [b.message]
    }
    return ["Something went wrong."]
  }
}
