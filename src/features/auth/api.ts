import type { AuthSuccessJson } from "@/features/auth/types"
import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import { executeRecaptcha } from "@/lib/recaptcha"

const DEVICE_NAME = "selair-web"

/**
 * A reCAPTCHA v3 token is minted here, immediately before the request, because
 * the token is single-use and lives about two minutes — anywhere earlier and a
 * visitor who pauses over their password is refused. `null` means the build has
 * no site key, in which case the API has no secret key either and is not
 * checking; the field is simply omitted.
 */
async function withRecaptcha<T extends object>(action: string, body: T) {
  const token = await executeRecaptcha(action)
  return token === null ? body : { ...body, recaptcha_token: token }
}

export async function login(body: { email: string; password: string }) {
  const payload = await withRecaptcha("login", {
    email: body.email,
    password: body.password,
    device_name: DEVICE_NAME,
  })
  const res = await api.post<AuthSuccessJson>(apiPath("auth/login"), payload)
  return res.data
}

export async function register(body: {
  name: string
  email: string
  password: string
  password_confirmation: string
}) {
  const payload = await withRecaptcha("register", {
    name: body.name,
    email: body.email,
    password: body.password,
    password_confirmation: body.password_confirmation,
    device_name: DEVICE_NAME,
  })
  const res = await api.post<AuthSuccessJson>(apiPath("auth/register"), payload)
  return res.data
}

export function logout() {
  return api.post(apiPath("auth/logout")).then(() => undefined)
}
