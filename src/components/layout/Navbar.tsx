import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ListIcon,
  MagnifyingGlassIcon,
  ToteIcon as CartIcon,
  XIcon,
} from "@phosphor-icons/react"

import { CartSheet } from "@/components/layout/CartSheet"
import {
  categoryNavItems,
  SITE_LOGO_TEXT,
  utilityLinks,
} from "@/components/layout/nav-config"
import { Button } from "@/components/ui/button"
import { cartItemCount } from "@/features/cart/data/cartItems"
import { cn } from "@/lib/utils"

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
              className="font-heading absolute left-1/2 -translate-x-1/2 text-center text-base font-normal tracking-tighter text-black uppercase sm:text-lg"
            >
              {SITE_LOGO_TEXT}
            </Link>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="View cart"
                aria-expanded={cartOpen}
                aria-controls="cart-sheet"
                onClick={() => setCartOpen(true)}
                className="relative size-10 shrink-0 rounded-full text-black sm:mr-2"
              >
                <CartIcon size={32} weight="regular" className="size-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-neutral-200 bg-black px-1 text-[11px] font-medium text-white">
                  {cartItemCount}
                </span>
              </Button>
              <Button variant="pill" asChild className={navPillClass}>
                <Link to="/login">Sign In</Link>
              </Button>

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
