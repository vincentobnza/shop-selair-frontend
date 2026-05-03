import type { AuthSuccessJson } from "@/features/auth/types"
import { api } from "@/lib/axios"

const DEVICE_NAME = "selair-web"

export function login(body: { email: string; password: string }) {
  return api
    .post<AuthSuccessJson>("/api/v1/auth/login", {
      email: body.email,
      password: body.password,
      device_name: DEVICE_NAME,
    })
    .then((r) => r.data)
}

export function register(body: {
  name: string
  email: string
  password: string
  password_confirmation: string
}) {
  return api
    .post<AuthSuccessJson>("/api/v1/auth/register", {
      name: body.name,
      email: body.email,
      password: body.password,
      password_confirmation: body.password_confirmation,
      device_name: DEVICE_NAME,
    })
    .then((r) => r.data)
}

export function logout() {
  return api.post("/api/v1/auth/logout").then(() => undefined)
}
