import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChatCircleDotsIcon,
  PaperPlaneRightIcon,
  XIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { BRAND } from "@/config/brand"
import { useAuth } from "@/features/auth/store"
import { toUserMessage } from "@/features/auth/errors"
import {
  useChatThread,
  useChatUnread,
  useMarkChatRead,
  useSendMessage,
} from "@/features/chat/queries"
import type { ChatMessage } from "@/features/chat/types"
import { formatClockTime, formatDayDivider, isSameDay } from "@/lib/dates"
import { cn } from "@/lib/utils"

/** Matches the API's own limit, so the counter and the server agree. */
const MAX_LENGTH = 2000

/** Messages closer together than this from one sender read as a single turn. */
const GROUP_WINDOW_MS = 5 * 60 * 1000

/**
 * Support chat, pinned to every page.
 *
 * Questions arrive mid-browse and mid-checkout, which is exactly where a
 * dedicated messages page cannot reach. The bubble stays out of the way until
 * there is something to say — or something waiting to be read.
 */
export function ChatWidget() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  // The badge is only worth fetching while the panel is shut; once it is open
  // the thread itself is the source of truth.
  const { data: unread = 0 } = useChatUnread(!open)

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {open ? <ChatPanel onClose={() => setOpen(false)} /> : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          unread > 0
            ? `Messages, ${unread} unread`
            : open
              ? "Close messages"
              : "Open messages"
        }
        className={cn(
          "fixed right-4 bottom-4 z-40 flex size-14 cursor-pointer items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform",
          "hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        )}
      >
        {open ? (
          <XIcon className="size-6" weight="bold" aria-hidden />
        ) : (
          <ChatCircleDotsIcon className="size-6" weight="fill" aria-hidden />
        )}

        {!open && unread > 0 ? (
          <span
            className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[0.7rem] font-semibold text-white ring-2 ring-paper"
            aria-hidden
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
    </>
  )
}

type Grouped = {
  message: ChatMessage
  startsGroup: boolean
  endsGroup: boolean
  dayBreak: boolean
}

/** Turn a flat list into runs, so a burst of messages reads as one turn. */
function group(messages: ChatMessage[]): Grouped[] {
  return messages.map((message, i) => {
    const prev = messages[i - 1]
    const next = messages[i + 1]

    const gapFrom = (a?: ChatMessage) =>
      a && a.created_at && message.created_at
        ? Math.abs(
            new Date(message.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        : Number.POSITIVE_INFINITY

    const dayBreak = !prev || !isSameDay(prev.created_at, message.created_at)
    const sameAsPrev =
      Boolean(prev) &&
      prev.sender_role === message.sender_role &&
      gapFrom(prev) < GROUP_WINDOW_MS &&
      !dayBreak
    const sameAsNext =
      Boolean(next) &&
      next.sender_role === message.sender_role &&
      gapFrom(next) < GROUP_WINDOW_MS &&
      isSameDay(next.created_at, message.created_at)

    return {
      message,
      startsGroup: !sameAsPrev,
      endsGroup: !sameAsNext,
      dayBreak,
    }
  })
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { data, isLoading, isError } = useChatThread(true)
  const send = useSendMessage()
  const markRead = useMarkChatRead()

  const [draft, setDraft] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  const messages = useMemo(() => data?.messages ?? [], [data])
  const grouped = useMemo(() => group(messages), [messages])

  // Follow the conversation down as it grows, and on first paint.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length])

  /*
   * Clear the badge once replies are actually on screen. Keyed on the newest
   * message so a reply arriving while the panel is open is marked read too,
   * rather than only what was there when it opened.
   */
  const newestId = messages.at(-1)?.id
  const markReadMutate = markRead.mutate
  useEffect(() => {
    if (data && data.conversation.unread > 0) {
      markReadMutate()
    }
  }, [data, newestId, markReadMutate])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const body = draft.trim()
    if (!body || send.isPending) {
      return
    }
    setDraft("")
    send.mutate(body, {
      onError: (error) => {
        // Give the text back rather than losing what they typed.
        setDraft(body)
        toast.error(toUserMessage(error))
      },
    })
  }

  return (
    <section
      aria-label="Messages"
      className="fixed right-4 bottom-22 z-40 flex h-[min(32rem,calc(100dvh-8rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_28px_70px_-30px_rgb(45_45_45/0.45)]"
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-base font-semibold text-white"
        >
          {BRAND.name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-medium text-ink">
            {BRAND.name}
          </h2>
          <p className="truncate text-[0.75rem] text-ink-soft">
            Usually replies within a few hours
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close messages"
          className="-mr-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-pink-light hover:text-ink"
        >
          <XIcon className="size-4" weight="bold" aria-hidden />
        </button>
      </header>

      <div
        className="flex-1 overflow-y-auto bg-pink-light/25 px-4 py-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {isLoading ? (
          <p className="py-10 text-center text-base text-ink-soft">Loading…</p>
        ) : isError ? (
          <p className="py-10 text-center text-base text-red-700">
            We couldn’t load your messages. Please try again.
          </p>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center">
            <ChatCircleDotsIcon
              className="mx-auto size-9 text-ink-soft/40"
              weight="duotone"
              aria-hidden
            />
            <p className="mt-2 text-base text-ink">Say hello</p>
            <p className="mt-1 text-base text-ink-soft">
              Ask us about sizing, availability, or an order — we’re happy to
              help.
            </p>
          </div>
        ) : (
          grouped.map((item) => <Row key={item.message.id} item={item} />)
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={submit}
        className="flex items-end gap-2 border-t border-line px-3 py-3"
      >
        <label htmlFor="chat-draft" className="sr-only">
          Your message — Enter to send, Shift+Enter for a new line
        </label>
        <textarea
          id="chat-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter makes a new line — the convention
            // everywhere else people type messages.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit(e)
            }
          }}
          rows={1}
          placeholder="Write a message…"
          className="max-h-28 min-h-10 flex-1 resize-none rounded-3xl bg-pink-light/60 px-4 py-2.5 text-base text-ink outline-none placeholder:text-ink-soft focus-visible:ring-2 focus-visible:ring-ink/20"
        />
        <Button
          type="submit"
          variant="pill"
          size="icon"
          disabled={draft.trim().length === 0 || send.isPending}
          aria-label="Send message"
          className="size-10 shrink-0"
        >
          <PaperPlaneRightIcon className="size-4" weight="fill" aria-hidden />
        </Button>
      </form>
    </section>
  )
}

function Row({ item }: { item: Grouped }) {
  const { message, startsGroup, endsGroup, dayBreak } = item
  const mine = message.sender_role === "customer"
  // Optimistic rows carry a temporary id until the server's copy replaces them.
  const pending = message.id.startsWith("pending-")

  return (
    <>
      {dayBreak ? (
        <div className="my-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[0.7rem] font-medium text-ink-soft">
            {formatDayDivider(message.created_at)}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
      ) : null}

      <div
        className={cn(
          "flex items-end gap-2",
          endsGroup ? "mb-2" : "mb-0.5",
          mine ? "justify-end" : "justify-start"
        )}
      >
        {/*
          The shop's mark sits with the last message of an incoming run. A
          gutter holds its place on the rows above so the run stays aligned.
        */}
        {!mine ? (
          endsGroup ? (
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-[0.7rem] font-semibold text-white"
            >
              {BRAND.name.slice(0, 1)}
            </span>
          ) : (
            <span className="size-7 shrink-0" aria-hidden />
          )
        ) : null}

        <div className="max-w-[78%]">
          <p
            title={formatClockTime(message.created_at)}
            className={cn(
              "rounded-2xl px-3.5 py-2 text-base whitespace-pre-wrap",
              mine ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line",
              // Square off the inner corner of a run so consecutive bubbles
              // read as one block, the way every chat client draws them.
              mine && !startsGroup && "rounded-tr-md",
              mine && !endsGroup && "rounded-br-md",
              !mine && !startsGroup && "rounded-tl-md",
              !mine && !endsGroup && "rounded-bl-md",
              pending && "opacity-60"
            )}
          >
            <span className="sr-only">
              {mine ? "You said: " : "The shop said: "}
            </span>
            {message.body}
          </p>

          {endsGroup ? (
            <p
              className={cn(
                "mt-0.5 px-1 text-[0.7rem] text-ink-soft",
                mine ? "text-right" : "text-left"
              )}
            >
              {formatClockTime(message.created_at)}
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}
