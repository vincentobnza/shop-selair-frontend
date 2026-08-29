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

  /*
   * Let the browser own the content type for uploads.
   *
   * The instance default is application/json, and axios takes that literally:
   * given a JSON content type it serialises a FormData body through
   * formDataToJSON, which turns a File into {} and posts {"file":{}}. The API
   * then sees no multipart part at all and answers "No file was uploaded."
   * Dropping the header here lets the browser set
   * multipart/form-data; boundary=… — the only thing that can generate a valid
   * boundary — for every upload, not just the one that surfaced the bug.
   *
   * Mirrors the same interceptor in the admin console.
   */
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type")
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
