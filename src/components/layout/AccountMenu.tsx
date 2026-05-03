import { useState } from "react"
import { Link } from "react-router-dom"
import { SignOutIcon } from "@phosphor-icons/react"

import { ACCOUNT_MENU_LINKS } from "@/components/layout/account-menu-config"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/store"

const itemClass =
  "block w-full px-3 h-9 text-left text-sm text-black transition-colors hover:bg-neutral-50 flex items-center gap-2 hover:underline "

type AccountMenuProps = {
  signingOut: boolean
  onSignOut: () => void | Promise<void>
}

export function AccountMenu({ signingOut, onSignOut }: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const close = () => setOpen(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={
            user?.email ? `My account, ${user.email}` : "My account"
          }
          aria-expanded={open}
          aria-haspopup="dialog"
          title={user?.email ?? undefined}
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded p-0 text-black touch-manipulation",
            "sm:h-auto sm:min-h-10 sm:w-auto sm:max-w-[min(46vw,13rem)] sm:justify-start sm:gap-2 sm:px-2.5 sm:py-2",
          )}
        >
          <span className="hidden min-w-0 flex-1 truncate text-left text-sm  font-medium text-black sm:inline">
            {user?.email}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,17rem)] rounded-none! border border-black bg-white p-0  ring-0"
      >
        <div className="border-b border-black px-3 py-2.5">
          <p className="text-xs sm:text-sm md:text-base font-semibold text-black ">
            My account
          </p>

          {/* USER EMAIL */}
          <small className="text-[10px] sm:text-xs text-muted-foreground font-medium ">
            {user?.email}
          </small>
        </div>
        <nav aria-label="Account">
          {ACCOUNT_MENU_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={itemClass}
              onClick={close}
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            disabled={signingOut}
            className={cn(itemClass, "mt-1 border-t h-10! border-black text-black disabled:opacity-50")}
            onClick={() => {
              void onSignOut()
              close()
            }}
          >
            <SignOutIcon weight="regular" className="size-4" />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </nav>
      </PopoverContent>
    </Popover>
  )
}
