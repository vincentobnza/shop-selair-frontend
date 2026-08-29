import { Link, useParams } from "react-router-dom"
import { ACCOUNT_SECTION_TITLES } from "@/config/account-routes"
export function AccountSectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const title = (slug && ACCOUNT_SECTION_TITLES[slug]) ?? "Account"

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-base text-ink-soft">
        <Link to="/" className="text-ink hover:underline">
          Home
        </Link>
        <span className="mx-2 text-ink-soft">/</span>{" "}
        <span className="text-ink">Account</span>
      </p>
      <h1 className="mt-4 text-3xl text-ink">{title}</h1>{" "}
      <p className="mt-2 text-base text-ink-soft">This area is coming soon.</p>
    </main>
  )
}
