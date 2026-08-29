import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/features/auth/store"
import * as chatApi from "./api"
import type { ChatMessage, ChatThread } from "./types"

export const chatKeys = {
  all: ["chat"] as const,
  thread: () => [...chatKeys.all, "thread"] as const,
  unread: () => [...chatKeys.all, "unread"] as const,
}

/**
 * How often each side of the widget checks in.
 *
 * An open thread polls briskly because someone is watching it; the closed
 * bubble only needs to know a reply exists, so it checks rarely. Both stop
 * entirely when the tab is in the background — `refetchIntervalInBackground`
 * defaults to false — so a forgotten tab costs nothing.
 */
const OPEN_THREAD_MS = 4000
const BADGE_ONLY_MS = 60000

/** The thread. Polls only while the panel is open. */
export function useChatThread(open: boolean) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: chatKeys.thread(),
    queryFn: () => chatApi.fetchThread(),
    enabled: isAuthenticated && open,
    refetchInterval: open ? OPEN_THREAD_MS : false,
  })
}

/** Unread badge for the closed bubble. */
export function useChatUnread(enabled: boolean) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: chatKeys.unread(),
    queryFn: () => chatApi.fetchUnread(),
    enabled: isAuthenticated && enabled,
    refetchInterval: BADGE_ONLY_MS,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: string) => chatApi.sendMessage(body),
    /*
     * Show the message immediately rather than waiting for the round trip —
     * a chat that lags behind your own typing feels broken. The optimistic row
     * carries a temporary id; the refetch below replaces it with the real one.
     */
    onMutate: async (body: string) => {
      await qc.cancelQueries({ queryKey: chatKeys.thread() })
      const previous = qc.getQueryData<ChatThread>(chatKeys.thread())

      if (previous) {
        const pending: ChatMessage = {
          id: `pending-${Date.now()}`,
          conversation_id: previous.conversation.id,
          sender_role: "customer",
          body,
          read_at: null,
          created_at: new Date().toISOString(),
        }
        qc.setQueryData<ChatThread>(chatKeys.thread(), {
          ...previous,
          messages: [...previous.messages, pending],
        })
      }

      return { previous }
    },
    onError: (_error, _body, context) => {
      // Put the thread back as it was; the caller surfaces the failure.
      if (context?.previous) {
        qc.setQueryData(chatKeys.thread(), context.previous)
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: chatKeys.thread() })
    },
  })
}

/** Clear the customer's unread count once they have the thread on screen. */
export function useMarkChatRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => chatApi.markRead(),
    onSuccess: () => {
      qc.setQueryData(chatKeys.unread(), 0)
      void qc.invalidateQueries({ queryKey: chatKeys.thread() })
    },
  })
}
