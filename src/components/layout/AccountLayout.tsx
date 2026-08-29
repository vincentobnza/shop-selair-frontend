import {
  BellIcon,
  GearSixIcon,
  MapPinIcon,
  PackageIcon,
  SignOutIcon,
  StarIcon,
  UserIcon,
} from "@phosphor-icons/react"
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks"
import { useLogout } from "@/features/auth/hooks"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/account/profile", label: "Profile", icon: UserIcon },
  { to: "/account/orders", label: "Orders", icon: PackageIcon },
  { to: "/account/reviews", label: "Reviews", icon: StarIcon },
  { to: "/account/addresses", label: "Addresses", icon: MapPinIcon },
  { to: "/account/notifications", label: "Notifications", icon: BellIcon },
  { to: "/account/settings", label: "Settings", icon: GearSixIcon },
]

export function AccountLayout() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const { run: logout, pending } = useLogout()

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ backTo: location.pathname }} replace />
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink sm:text-3xl">
          My Account
        </h1>
        {user ? (
          <p className="mt-1 text-base text-ink-soft">
            {user.name} · {user.email}
          </p>
        ) : null}
      </header>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-base font-medium transition",
                    isActive
                      ? "bg-ink text-white"
                      : "text-ink-soft hover:bg-pink-light hover:text-ink"
                  )
                }
              >
                <Icon size={18} weight="regular" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => void logout()}
              disabled={pending}
              className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-base font-medium text-ink-soft transition hover:bg-pink-light hover:text-ink disabled:opacity-50"
            >
              <SignOutIcon size={18} weight="regular" />{" "}
              {pending ? "Signing out…" : "Sign out"}
            </button>
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
