import {
  BellIcon,
  GearSixIcon,
  MapPinIcon,
  PackageIcon,
  SignOutIcon,
  StarIcon,
  UserIcon,
} from "@phosphor-icons/react"
import { format } from "date-fns"
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom"

import { UserAvatar } from "@/components/user-avatar"
import { PRIMARY_CONTACT } from "@/config/brand"
import { useAuth, useLogout } from "@/features/auth/hooks"
import { useNotificationBadge } from "@/features/notifications/queries"
import { useMe } from "@/features/users/queries"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/account/profile", label: "Profile", icon: UserIcon },
  { to: "/account/orders", label: "Orders", icon: PackageIcon },
  { to: "/account/reviews", label: "Reviews", icon: StarIcon },
  { to: "/account/addresses", label: "Addresses", icon: MapPinIcon },
  {
    to: "/account/notifications",
    label: "Notifications",
    icon: BellIcon,
    badge: true,
  },
  { to: "/account/settings", label: "Settings", icon: GearSixIcon },
]

/**
 * Account shell: an identity card and section nav in a sticky left rail, with
 * the section content beside it.
 *
 * The rail collapses to a horizontally scrolling row below `lg`, so a phone
 * never has to scroll past six nav rows to reach the content.
 */
export function AccountLayout() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const { run: logout, pending } = useLogout()
  const { data: me } = useMe(isAuthenticated)
  /* Polls from anywhere in the account area, and refreshes the order queries
     when the count rises — see useNotificationBadge. */
  const { unread } = useNotificationBadge()

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ backTo: location.pathname }} replace />
    )
  }

  const name = user?.name ?? "Account"
  const joined = me?.created_at ? new Date(me.created_at) : null

  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-8">
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 font-heading text-3xl leading-tight font-medium text-ink sm:text-4xl">
            {name}
          </h1>
        </header>

        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          {/*
            min-w-0 is what makes the nav below scroll instead of stretching:
            a grid item defaults to min-width:auto, so without it the rail is
            as wide as its widest content — six nav pills in a row — and drags
            the whole account page off the side of a phone.
          */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-4 rounded-[1.75rem] bg-white p-6">
              <UserAvatar
                id={user?.id}
                name={name}
                src={user?.avatar_url}
                size="lg"
              />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ink">
                  {name}
                </p>
                <p className="truncate text-base text-ink-soft">
                  {user?.email}
                </p>
                {joined ? (
                  <p className="mt-0.5 text-base text-ink-soft">
                    Joined {format(joined, "MMM yyyy")}
                  </p>
                ) : null}
              </div>
            </div>

            <nav
              aria-label="Account sections"
              className="mt-4 no-scrollbar flex snap-x snap-mandatory scroll-p-3 gap-1 overflow-x-auto rounded-[1.75rem] bg-white p-3 lg:snap-none lg:flex-col lg:overflow-visible"
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-12 shrink-0 snap-start items-center gap-3 rounded-full px-4 text-base transition-colors",
                      isActive
                        ? "bg-pink-light font-semibold text-brand"
                        : "text-ink hover:bg-pink-light/60"
                    )
                  }
                >
                  <Icon size={20} weight="regular" />
                  {label}
                  {badge && unread > 0 ? (
                    /* The count is in the pill and repeated in the label, so
                       "Notifications 3" is what a screen reader announces
                       rather than an unexplained number. */
                    <span
                      className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-brand px-2 py-0.5 text-sm font-semibold text-white"
                      aria-label={`${unread} unread`}
                    >
                      {unread > 99 ? "99+" : unread}
                    </span>
                  ) : null}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={() => void logout()}
                disabled={pending}
                className="flex min-h-12 shrink-0 cursor-pointer items-center gap-3 rounded-full px-4 text-base text-ink-soft transition-colors hover:bg-pink-light/60 hover:text-ink disabled:opacity-50 lg:mt-1"
              >
                <SignOutIcon size={20} weight="regular" />
                {pending ? "Signing out…" : "Sign out"}
              </button>
            </nav>

            <div className="mt-4 hidden rounded-[1.75rem] bg-white p-6 lg:block">
              <p className="text-base font-semibold text-ink">
                Planning an occasion?
              </p>
              <p className="mt-1 text-base text-ink-soft">
                Tell us the date and dress code and we will hold the pieces and
                set up a fitting.
              </p>
              <a
                href={PRIMARY_CONTACT.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center text-base font-medium text-brand underline underline-offset-4"
              >
                {PRIMARY_CONTACT.label}
              </a>
            </div>
          </aside>

          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </main>
  )
}
