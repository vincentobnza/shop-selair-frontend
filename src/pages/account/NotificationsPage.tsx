import { BellIcon } from "@phosphor-icons/react"

/**
 * Notifications inbox. The backend does not yet emit notification events, so this
 * presents a polished empty state rather than fabricating data. When a
 * notifications API is added, wire a query here and render the feed.
 */
export function NotificationsPage() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium text-ink">Notifications</h2>{" "}
      <div className="flex flex-col items-center rounded-sm bg-pink-light px-6 py-16 text-center">
        <BellIcon size={40} className="text-line" />{" "}
        <p className="mt-3 text-lg text-ink">You’re all caught up</p>{" "}
        <p className="mt-1 max-w-sm text-base text-ink-soft">
          Order updates and promotions will show up here.
        </p>
      </div>
    </div>
  )
}
