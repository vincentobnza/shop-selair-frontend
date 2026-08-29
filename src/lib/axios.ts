import axios from "axios"

import { ApiError } from "@/features/auth/errors"
import { getApiBaseUrl } from "@/lib/api-base"

/** Injected after store init so requests can attach `Authorization` without a circular import. */
let getAuthToken: () => string | null = () => null

export function bindAuthTokenGetter(getter: () => string | null): void {
  getAuthToken = getter
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const body = error.response?.data ?? error.message
      return Promise.reject(new ApiError(status, body))
    }
    return Promise.reject(error)
  }
)
