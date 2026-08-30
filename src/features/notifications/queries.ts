import { useEffect, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/features/auth/store"
import { orderKeys } from "@/features/orders/queries"
import * as notificationsApi from "./api"
import type { AppNotification } from "./types"

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
}

/**
 * How often the badge checks in.
 *
 * Matches the chat bubble's badge interval, and for the same reasons: an order
 * moving is a minutes-scale event, not a seconds-scale one, and React Query
 * stops polling entirely when the tab is in the background
 * (`refetchIntervalInBackground` defaults to false), so a forgotten tab costs
 * nothing. There is no WebSocket anywhere in this app; when one arrives, this
 * is the single place that changes.
 */
const BADGE_POLL_MS = 60000

/**
 * The unread badge, and the app's only trigger for "something changed server-side".
 *
 * When the count goes *up*, an order almost certainly moved — the only things
 * that write a notification are status changes and payments. So this also
 * invalidates the order queries, which is what makes an order the shop shipped
 * appear as shipped without the customer reloading the page. Without it the
 * badge would light up next to a list still showing the old status, which reads
 * as broken more than no notification at all does.
 */
export function useNotificationBadge() {
  const { isAuthenticated } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: () => notificationsApi.fetchUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: BADGE_POLL_MS,
  })

  const previous = useRef<number | null>(null)
  const count = query.data

  useEffect(() => {
    if (count === undefined) return

    const before = previous.current
    previous.current = count

    // Only on a rise. Marking things read lowers the count and must not kick
    // off a refetch storm of its own.
    if (before !== null && count > before) {
      void qc.invalidateQueries({ queryKey: orderKeys.all })
      void qc.invalidateQueries({ queryKey: notificationKeys.list() })
    }
  }, [count, qc])

  return { unread: count ?? 0, isLoading: query.isLoading }
}

/** The inbox itself. Polls while open, like the chat thread does. */
export function useNotifications(enabled = true) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationsApi.fetchNotifications(),
    enabled: isAuthenticated && enabled,
    refetchInterval: enabled ? BADGE_POLL_MS : false,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markNotificationRead(id),
    /*
     * Optimistic: tapping a row should mark it read instantly. The round trip
     * is not something anyone should watch, and a row that stays bold for half
     * a second after you tap it reads as a failed tap.
     */
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: notificationKeys.list() })
      const previous = qc.getQueryData<AppNotification[]>(
        notificationKeys.list()
      )

      if (previous) {
        const alreadyRead = previous.find((n) => n.id === id)?.read_at !== null
        qc.setQueryData<AppNotification[]>(
          notificationKeys.list(),
          previous.map((n) =>
            n.id === id && n.read_at === null
              ? { ...n, read_at: new Date().toISOString() }
              : n
          )
        )
        // Keep the badge in step, without letting it fall below zero if the
        // row was already read.
        if (!alreadyRead) {
          qc.setQueryData<number>(notificationKeys.unread(), (c) =>
            Math.max(0, (c ?? 1) - 1)
          )
        }
      }

      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(notificationKeys.list(), context.previous)
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: notificationKeys.unread() })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsRead(),
    onSuccess: () => {
      qc.setQueryData(notificationKeys.unread(), 0)
      void qc.invalidateQueries({ queryKey: notificationKeys.list() })
    },
  })
}
