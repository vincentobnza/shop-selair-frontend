import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ListIcon,
  MagnifyingGlassIcon,
  ToteIcon as CartIcon,
  XIcon,
  HeartIcon,
} from "@phosphor-icons/react"

import { CartSheet } from "@/components/layout/CartSheet"
import { AccountMenu } from "@/components/layout/AccountMenu"
import { ACCOUNT_MENU_LINKS } from "@/components/layout/account-menu-config"
import {
  categoryNavItems,
  SITE_LOGO_TEXT,
  utilityLinks,
} from "@/components/layout/nav-config"
import { Button } from "@/components/ui/button"
import { useAuth, useLogout } from "@/features/auth/hooks"
import { useCartItemCount } from "@/features/cart/cartStore"
import { cn } from "@/lib/utils"
import { TooltipComponent } from "../TooltipComponent"

const navPillClass =
  "hidden h-auto min-h-9 px-4 py-2 text-xs font-medium tracking-wide sm:inline-flex sm:min-h-10 sm:text-sm"

function CategoryLink({
  to,
  label,
  accent,
}: {
  to: string
  label: string
  accent?: boolean
}) {
  const cls = cn(
    "whitespace-nowrap text-[13px] leading-none transition-colors sm:text-sm",
    accent
      ? "text-nav-sale hover:text-nav-sale/90"
      : "text-black hover:text-neutral-600",
  )

  return (
    <Link to={to} className={cls}>
      {label}
    </Link>
  )
}

export function Navbar() {
  const { isAuthenticated } = useAuth()
  const { run: signOut, pending: signingOut } = useLogout()
  const cartItemCount = useCartItemCount()

  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)


  return (
    <>
      <header className="sticky top-10 z-50 w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="relative flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-black sm:gap-3">
              <Link
                to={utilityLinks.howItWorks.href}
                className="hidden shrink-0 hover:text-neutral-600 sm:inline"
              >
                {utilityLinks.howItWorks.label}
              </Link>
              <span
                aria-hidden
                className="hidden h-3 w-px shrink-0 bg-neutral-300 sm:block"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="hidden h-9 w-9 shrink-0 rounded-full text-black sm:inline-flex sm:h-10 sm:w-10"
              >
                <MagnifyingGlassIcon size={22} weight="regular" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-panel"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-9 w-9 shrink-0 rounded-full text-black sm:hidden"
              >
                {menuOpen ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
              </Button>
            </div>

            <Link
              to="/"
              className="font-heading absolute left-1/2 -translate-x-1/2 text-center text-base font-normal er text-black uppercase sm:text-lg"
            >
              {SITE_LOGO_TEXT}
            </Link>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <TooltipComponent side="bottom" content="View wishlist">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="View wishlist"
                  className="hidden sm:block relative size-10 shrink-0 rounded-full text-black "
                >
                  <HeartIcon size={32} weight="regular" className="size-5" />
                </Button>
              </TooltipComponent>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="View cart"
                aria-expanded={cartOpen}
                aria-controls="cart-sheet"
                onClick={() => setCartOpen(true)}
                className="relative size-10 shrink-0 rounded-full text-black "
              >
                <CartIcon size={32} weight="regular" className="size-5" />
                {
                  cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-neutral-200 bg-black px-1 text-[11px] font-medium text-white">
                      {cartItemCount}
                    </span>
                  )
                }
              </Button>


              {isAuthenticated ? (
                <AccountMenu
                  signingOut={signingOut}
                  onSignOut={() => void signOut()}
                />
              ) : (
                <div className="ml-2 flex gap-1">
                  <Button variant="outline" asChild className={cn(navPillClass, "rounded-full")}>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="pill" asChild className={navPillClass}>
                    <Link to="/signup">Join Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <nav
            aria-label="Categories"
            className="hidden border-t border-neutral-100 py-2.5 sm:block"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-5 lg:flex-nowrap lg:justify-between lg:gap-x-3">
              {categoryNavItems.map((item) => (
                <li key={item.label}>
                  <CategoryLink
                    to={item.to}
                    label={item.label}
                    accent={item.variant === "accent"}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {menuOpen ? (
            <div
              id="mobile-nav-panel"
              className="border-t border-neutral-100 pb-4 sm:hidden"
            >
              <div className="flex flex-col gap-3 pt-3">
                <Link
                  to={utilityLinks.howItWorks.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-black"
                >
                  {utilityLinks.howItWorks.label}
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Search"
                  className="h-auto justify-start gap-2 px-0 py-1 font-normal text-black hover:bg-transparent"
                >
                  <MagnifyingGlassIcon size={20} weight="regular" />
                  Search
                </Button>
                <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-3">
                  {isAuthenticated ? (
                    <div className="w-full">
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-black uppercase">
                        My account
                      </p>
                      <ul className="mt-2 grid gap-0.5">
                        {ACCOUNT_MENU_LINKS.map(({ label, to }) => (
                          <li key={to}>
                            <Link
                              to={to}
                              onClick={() => setMenuOpen(false)}
                              className="block rounded-md py-2 text-sm text-black hover:bg-neutral-50"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                        <li className="border-t border-neutral-100 pt-1">
                          <button
                            type="button"
                            disabled={signingOut}
                            className="w-full rounded-md py-2 text-left text-sm text-black hover:bg-neutral-50 disabled:opacity-50"
                            onClick={() => {
                              void signOut()
                              setMenuOpen(false)
                            }}
                          >
                            {signingOut ? "Signing out…" : "Sign Out"}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="pill"
                        asChild
                        className="h-auto min-h-10 flex-1 basis-0 py-2.5 text-sm"
                      >
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        variant="pill"
                        asChild
                        className="h-auto min-h-10 flex-1 basis-0 py-2.5 text-sm"
                      >
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                          Join Now
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
                <ul className="grid gap-2 border-t border-neutral-100 pt-3">
                  {categoryNavItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "block py-1 text-sm",
                          item.variant === "accent"
                            ? "font-medium text-nav-sale"
                            : "text-black",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
