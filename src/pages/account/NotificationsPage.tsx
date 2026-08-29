import { EmptyState } from "@/components/ui/empty-state"

/**
 * Notifications inbox. The backend does not yet emit notification events, so this
 * presents a polished empty state rather than fabricating data. When a
 * notifications API is added, wire a query here and render the feed.
 */
export function NotificationsPage() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium text-ink">Notifications</h2>{" "}
      <EmptyState
        art="bell"
        title="You are all caught up"
        description="Booking updates, fitting reminders and new arrivals will show up here."
      />
    </div>
  )
}
