import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

export type ApiUser = {
  id: string
  name: string
  email: string
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export async function fetchMe(): Promise<ApiUser> {
  const res = await api.get<{ user: ApiUser }>(apiPath("users/me"))
  return res.data.user
}

export async function updateProfile(
  userId: string,
  input: { name?: string; email?: string },
): Promise<ApiUser> {
  const res = await api.put<{ user: ApiUser }>(apiPath(`users/${userId}`), input)
  return res.data.user
}
