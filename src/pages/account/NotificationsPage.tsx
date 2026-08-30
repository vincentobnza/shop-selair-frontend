import {
  BellIcon,
  CreditCardIcon,
  MegaphoneIcon,
  PackageIcon,
} from "@phosphor-icons/react"
import { formatDistanceToNow } from "date-fns"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/ui/empty-state"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/queries"
import type {
  AppNotification,
  NotificationType,
} from "@/features/notifications/types"
import { cn } from "@/lib/utils"

const ICONS: Record<NotificationType, typeof BellIcon> = {
  order_status: PackageIcon,
  payment: CreditCardIcon,
  reminder: BellIcon,
  announcement: MegaphoneIcon,
}

/**
 * Notifications inbox.
 *
 * Rows are written server-side the moment an order moves or a payment lands,
 * so this is a plain read of that feed — nothing is derived here. Unread rows
 * carry weight and a dot; opening one marks it read on the way out.
 */
export function NotificationsPage() {
  const { data: notifications, isLoading, isError } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount =
    notifications?.filter((n) => n.read_at === null).length ?? 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-medium text-ink">Notifications</h2>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="cursor-pointer text-base text-ink-soft underline-offset-4 hover:text-ink hover:underline disabled:opacity-60"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <ul className="space-y-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-24 animate-pulse rounded-l bg-pink-light" />
          ))}
        </ul>
      ) : isError ? (
        <EmptyState
          art="bell"
          title="We could not load your notifications"
          description="Check your connection and refresh the page."
        />
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState
          art="bell"
          title="You are all caught up"
          description="Booking updates, payment confirmations and fitting reminders will show up here."
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onOpen={() => {
                if (notification.read_at === null) {
                  markRead.mutate(notification.id)
                }
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function NotificationRow({
  notification,
  onOpen,
}: {
  notification: AppNotification
  onOpen: () => void
}) {
  const unread = notification.read_at === null
  const Icon = ICONS[notification.type] ?? BellIcon

  const body = (
    <>
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full",
          unread ? "bg-brand/10 text-brand" : "bg-pink-light text-ink-soft"
        )}
      >
        <Icon size={20} weight={unread ? "fill" : "regular"} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <span
            className={cn(
              "flex-1 text-base text-ink",
              unread ? "font-semibold" : "font-medium"
            )}
          >
            {notification.title}
          </span>

          {unread ? (
            /* The dot repeats what the weight already says, for anyone who
               does not perceive the weight difference. */
            <span
              className="mt-2 size-2 shrink-0 rounded-full bg-brand"
              aria-label="Unread"
            />
          ) : null}
        </span>

        <span className="mt-1 block text-base leading-relaxed text-ink-soft">
          {notification.body}
        </span>

        {notification.created_at ? (
          <time
            dateTime={notification.created_at}
            className="mt-1.5 block text-sm text-ink-soft"
          >
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
          </time>
        ) : null}
      </span>
    </>
  )

  const shell = cn(
    "flex w-full gap-3 rounded-l px-4 py-4 text-left transition-colors",
    unread ? "bg-pink-light/60" : "bg-white",
    "hover:bg-pink-light"
  )

  /*
   * A link when there is somewhere to go, a button when there is not.
   *
   * Both mark the row read, but only one of them is navigation — rendering a
   * link with no href, or a button that silently moves the page, is the kind of
   * thing that works with a mouse and breaks with a keyboard or a screen reader.
   */
  return (
    <li>
      {notification.link ? (
        <Link to={notification.link} onClick={onOpen} className={shell}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onOpen} className={cn(shell, "cursor-pointer")}>
          {body}
        </button>
      )}
    </li>
  )
}
