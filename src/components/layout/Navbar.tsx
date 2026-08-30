import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  CoatHangerIcon,
  ListIcon,
  MagnifyingGlassIcon,
  ToteIcon as CartIcon,
  UserIcon,
} from "@phosphor-icons/react"
import { BrowseDrawer } from "@/components/layout/BrowseDrawer"
import { CartSheet } from "@/components/layout/CartSheet"
import { useCartUiStore } from "@/features/cart/cartUiStore"
import { NavSearch } from "@/components/layout/NavSearch"
import { AccountMenu } from "@/components/layout/AccountMenu"
import { SITE_LOGO_TEXT, utilityLinks } from "@/components/layout/nav-config"
import { Button } from "@/components/ui/button"
import { TooltipComponent } from "@/components/TooltipComponent"
import { useAuth, useLogout } from "@/features/auth/hooks"
import { useCartItemCount } from "@/features/cart/cartStore"
import { useFavoriteCount } from "@/features/favorites/useFavoriteCount"

const UTILITY_LINKS = [
  utilityLinks.howItWorks,
  utilityLinks.explore,
  utilityLinks.fittings,
] as const

export function Navbar() {
  const { isAuthenticated } = useAuth()
  const { run: signOut, pending: signingOut } = useLogout()
  const cartItemCount = useCartItemCount()
  const favoriteCount = useFavoriteCount()
  const { pathname, search } = useLocation()

  /* Shared, so adding a piece from anywhere can bring the bag forward. */
  const cartOpen = useCartUiStore((s) => s.open)
  const setCartOpen = useCartUiStore((s) => s.setCartOpen)
  const cartReturnFocusTo = useCartUiStore((s) => s.returnFocusTo)
  const [browseOpen, setBrowseOpen] = useState(false)

  /*
   * A route change should never leave an overlay panel open behind the user —
   * including on browser back/forward, where no link handler runs. Resetting
   * during render (rather than in an effect) avoids the extra commit that a
   * post-render setState would cost on every navigation.
   */
  const locationKey = `${pathname}${search}`
  const [lastLocationKey, setLastLocationKey] = useState(locationKey)
  if (locationKey !== lastLocationKey) {
    setLastLocationKey(locationKey)
    setBrowseOpen(false)
  }

  return (
    <>
      {/*
       * Translucent header. It stays sticky rather than fixed so it starts
       * below the promo bar and pins once that scrolls away; the hero pulls up
       * by `--header-h` to sit underneath it, which is what gives the bar
       * something to blur. The `supports-` fallback keeps it nearly opaque
       * where backdrop-filter is unavailable, so the wordmark and links are
       * never left sitting on raw imagery.
       */}
      <header className="sticky top-0 z-50 w-full border-b border-line/70 bg-paper/95 backdrop-blur-sm supports-backdrop-filter:bg-paper/70">
        <div className="relative flex h-(--header-h) items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Left: browse + search */}
          <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-4">
            <button
              type="button"
              aria-label="Browse"
              aria-expanded={browseOpen}
              aria-controls="browse-drawer"
              onClick={() => setBrowseOpen(true)}
              className="hidden cursor-pointer items-center gap-2 rounded-full px-1 py-2 text-base text-ink transition-colors hover:text-brand sm:inline-flex"
            >
              <ListIcon size={20} weight="bold" />
              Browse
            </button>

            <NavSearch className="hidden flex-1 sm:flex sm:max-w-md" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Browse"
              aria-expanded={browseOpen}
              aria-controls="browse-drawer"
              onClick={() => setBrowseOpen(true)}
              className="inline-flex size-12 shrink-0 rounded-full text-ink sm:hidden"
            >
              <ListIcon weight="bold" className="size-6" />
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="inline-flex size-12 shrink-0 rounded-full text-ink sm:hidden"
            >
              <Link to="/search" aria-label="Search">
                <MagnifyingGlassIcon weight="regular" className="size-6" />
              </Link>
            </Button>
          </div>

          {/* Centre: wordmark */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-logo text-lg leading-none font-bold tracking-[-0.04em] text-ink sm:text-2xl"
          >
            {SITE_LOGO_TEXT.toLowerCase()}
          </Link>

          {/* Right: utility links + actions */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
            <nav aria-label="Utility" className="hidden lg:block">
              <ul className="mr-6 flex items-center gap-5">
                {UTILITY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-base whitespace-nowrap text-ink transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* A phone's bar has room for browse, search, the bag and the
                account before it starts to crowd; favourites stay one tap away
                from the footer. */}
            <TooltipComponent side="bottom" content="Favorites">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative size-12 shrink-0 rounded-full text-ink max-sm:hidden sm:size-11"
              >
                <Link
                  to="/favorites"
                  aria-label={
                    favoriteCount > 0
                      ? `Favorites, ${favoriteCount} pieces`
                      : "Favorites"
                  }
                >
                  {/* Bigger below `sm`: a 20px glyph in a 44px target is hard
                      to read on a phone held at arm's length, and this row is
                      the only navigation a mobile visitor gets. */}
                  <CoatHangerIcon
                    weight="regular"
                    className="size-6 sm:size-5"
                  />
                  {favoriteCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-base leading-none font-semibold text-white">
                      {favoriteCount}
                    </span>
                  ) : null}
                </Link>
              </Button>
            </TooltipComponent>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={
                cartItemCount > 0
                  ? `View cart, ${cartItemCount} items`
                  : "View cart"
              }
              aria-expanded={cartOpen}
              aria-controls="cart-sheet"
              onClick={() => setCartOpen(true)}
              className="relative size-12 shrink-0 rounded-full text-ink sm:size-11"
            >
              <CartIcon weight="regular" className="size-6 sm:size-5" />
              {cartItemCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-base leading-none font-semibold text-white">
                  {cartItemCount}
                </span>
              ) : null}
            </Button>
            {isAuthenticated ? (
              <AccountMenu
                signingOut={signingOut}
                onSignOut={() => void signOut()}
              />
            ) : (
              <>
                <TooltipComponent side="bottom" content="Sign in">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="inline-flex size-12 shrink-0 rounded-full text-ink sm:size-11"
                  >
                    <Link to="/login" aria-label="Sign in">
                      <UserIcon weight="regular" className="size-6 sm:size-5" />
                    </Link>
                  </Button>
                </TooltipComponent>
                <Button
                  variant="pill"
                  asChild
                  className="ml-1 hidden h-10 px-6 text-base font-semibold sm:inline-flex"
                >
                  <Link to="/signup">Join Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <BrowseDrawer open={browseOpen} onOpenChange={setBrowseOpen} />
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        returnFocusTo={cartReturnFocusTo}
      />
    </>
  )
}
