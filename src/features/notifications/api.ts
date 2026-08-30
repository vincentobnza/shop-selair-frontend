import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type { AppNotification } from "./types"

type Paginated<T> = { data: T[]; total: number }

export async function fetchNotifications(
  perPage = 30
): Promise<AppNotification[]> {
  const res = await api.get<Paginated<AppNotification>>(
    apiPath("notifications"),
    { params: { per_page: perPage } }
  )
  return res.data.data
}

/**
 * Just the badge number.
 *
 * A separate endpoint from the list on purpose: this one is polled from every
 * page, and it answers with a COUNT against an index rather than fetching rows.
 */
export async function fetchUnreadCount(): Promise<number> {
  const res = await api.get<{ data: { unread: number } }>(
    apiPath("notifications/unread-count")
  )
  return res.data.data.unread
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(apiPath(`notifications/${id}/read`))
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post(apiPath("notifications/read-all"))
}
