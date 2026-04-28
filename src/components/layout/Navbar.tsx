import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import {
  ShoppingBagIcon as CartIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@phosphor-icons/react"

import { CartSheet } from "@/components/layout/CartSheet"
import { cartItemCount } from "@/features/cart/data/cartItems"

const routeLinks = [
  { label: "Home", to: "/" },
  { label: "Rent", to: "/rent" },
  { label: "Shop", to: "/shop" },
  { label: "Essentials", to: "/essentials" },
]

const sectionLinks = [
  { label: "New Arrivals", to: "/#new-arrivals" },
  { label: "Why Selair", to: "/#why-selair" },
  { label: "Instagram", to: "/#follow-us" },
]

function navLinkClassName(isActive: boolean): string {
  return isActive
    ? "text-white font-medium"
    : "text-zinc-300 transition-colors hover:text-white"
}

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-neutral-900 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4">
            <Link
              to="/"
              className="font-heading text-xl tracking-tight text-white"
            >
              Shop Selair
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <ul className="flex items-center gap-6 text-sm">
                {routeLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) => navLinkClassName(isActive)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <ul className="flex items-center gap-6 border-l border-white/10 pl-6 text-sm">
                {sectionLinks.map((link) => (
                  <li key={link.to}>
                    <a
                      href={link.to}
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-zinc-700"
              >
                <MagnifyingGlassIcon size={22} weight="regular" />
              </button>
              <button
                type="button"
                aria-label="View cart"
                aria-expanded={isCartOpen}
                aria-controls="cart-sheet"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-zinc-700"
              >
                <CartIcon size={22} weight="regular" />
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-zinc-300 bg-white px-1 text-[11px] font-medium text-zinc-800">
                  {cartItemCount}
                </span>
              </button>

              <button
                type="button"
                aria-label="User account"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-zinc-700"
              >
                <UserIcon size={22} weight="regular" />
              </button>
            </div>
          </nav>

          <div className="flex flex-wrap items-center gap-2 pb-4 md:hidden">
            {routeLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-full border border-zinc-500 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900"
                    : "rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
                }
              >
                {link.label}
              </NavLink>
            ))}
            {sectionLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
