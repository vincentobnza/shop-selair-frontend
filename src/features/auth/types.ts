export type AuthUser = {
  id: string
  name: string
  email: string
  /** Uploaded picture. Null falls back to a generated avatar. */
  avatar_url?: string | null
}

export type AuthSuccessJson = {
  message: string
  user: AuthUser
  token: string
}
