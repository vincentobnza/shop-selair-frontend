export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthSuccessJson = {
  message: string
  user: AuthUser
  token: string
}
