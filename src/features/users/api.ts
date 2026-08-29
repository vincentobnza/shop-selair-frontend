import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

export type ApiUser = {
  id: string
  name: string
  email: string
  avatar_url: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export async function fetchMe(): Promise<ApiUser> {
  const res = await api.get<{ user: ApiUser }>(apiPath("users/me"))
  return res.data.user
}

/**
 * Upload a cropped avatar.
 *
 * The blob is already square and small — see `cropToBlob` — so this is a plain
 * multipart POST with no client-side resizing left to do. The request
 * interceptor in `lib/axios` drops the instance default Content-Type for any
 * FormData body, so the browser can set the multipart boundary itself.
 */
export async function uploadAvatar(blob: Blob): Promise<ApiUser> {
  const form = new FormData()
  form.append("file", blob, "avatar.jpg")
  const res = await api.post<{ user: ApiUser }>(
    apiPath("users/me/avatar"),
    form
  )
  return res.data.user
}

export async function removeAvatar(): Promise<ApiUser> {
  const res = await api.delete<{ user: ApiUser }>(apiPath("users/me/avatar"))
  return res.data.user
}

export async function updateProfile(
  userId: string,
  input: { name?: string; email?: string }
): Promise<ApiUser> {
  const res = await api.put<{ user: ApiUser }>(
    apiPath(`users/${userId}`),
    input
  )
  return res.data.user
}
