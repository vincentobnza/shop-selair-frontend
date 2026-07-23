import { BellIcon } from "@phosphor-icons/react"

/**
 * Notifications inbox. The backend does not yet emit notification events, so this
 * presents a polished empty state rather than fabricating data. When a
 * notifications API is added, wire a query here and render the feed.
 */
export function NotificationsPage() {
  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-medium text-zinc-900">Notifications</h2>
      <div className="flex flex-col items-center rounded-lg border border-dashed border-neutral-200 bg-zinc-50 px-6 py-16 text-center">
        <BellIcon size={40} className="text-zinc-300" />
        <p className="mt-3 font-heading text-lg text-zinc-900">You’re all caught up</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-600">
          Order updates and promotions will show up here.
        </p>
      </div>
    </div>
  )
}
