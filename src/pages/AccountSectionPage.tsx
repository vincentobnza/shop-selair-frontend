import { Link, useParams } from "react-router-dom"

const TITLES: Record<string, string> = {
  orders: "Order History",
  notifications: "Notifications",
  pickup: "Schedule Pickup",
  settings: "Settings",
  reviews: "Your Reviews",
  referral: "Get $30",
  profile: "Profile",
  credits: "Credits",
}

export function AccountSectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const title = (slug && TITLES[slug]) ?? "Account"

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm text-neutral-500">
        <Link to="/" className="text-neutral-800 hover:underline">
          Home
        </Link>
        <span className="mx-2 text-neutral-400">/</span>
        <span className="text-neutral-800">Account</span>
      </p>
      <h1 className="mt-4 font-heading text-3xl text-neutral-900">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">
        This area is coming soon.
      </p>
    </main>
  )
}
