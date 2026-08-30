/** What a notification is about — drives the icon and, later, preferences. */
export type NotificationType =
  | "order_status"
  | "payment"
  | "reminder"
  | "announcement"

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  body: string
  /** Storefront path this is about, e.g. `/account/orders/<id>`. Nullable. */
  link: string | null
  /** Null until the customer has seen it. */
  read_at: string | null
  created_at: string | null
}
