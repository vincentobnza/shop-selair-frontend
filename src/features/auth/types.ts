export type AuthUser = {
  id: number
  name: string
  email: string
}

export type AuthSuccessJson = {
  message: string
  user: AuthUser
  token: string
}
