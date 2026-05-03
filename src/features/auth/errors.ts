type LaravelErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

export function toUserMessage(error: unknown): string {
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
