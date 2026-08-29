import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type { ChatMessage, ChatThread } from "./types"

export async function fetchThread(): Promise<ChatThread> {
  const res = await api.get<{ data: ChatThread }>(apiPath("chat"))
  return res.data.data
}

export async function fetchUnread(): Promise<number> {
  const res = await api.get<{ data: { unread: number } }>(
    apiPath("chat/unread")
  )
  return res.data.data.unread
}

export async function sendMessage(body: string): Promise<ChatMessage> {
  const res = await api.post<{ data: ChatMessage }>(apiPath("chat/messages"), {
    body,
  })
  return res.data.data
}

export async function markRead(): Promise<void> {
  await api.post(apiPath("chat/read"))
}
