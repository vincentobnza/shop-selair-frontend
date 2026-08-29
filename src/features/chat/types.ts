export type MessageSender = "customer" | "staff"

export type ChatMessage = {
  id: string
  conversation_id: string
  sender_role: MessageSender
  body: string
  read_at: string | null
  created_at: string | null
}

export type ChatConversation = {
  id: string
  unread: number
  last_message_at: string | null
  created_at: string | null
}

export type ChatThread = {
  conversation: ChatConversation
  messages: ChatMessage[]
}
