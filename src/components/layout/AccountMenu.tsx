import { useState } from "react"
import { Link } from "react-router-dom"
import { ACCOUNT_MENU_LINKS } from "@/components/layout/account-menu-config"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/store"

const itemClass = "overlay-item"

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
          aria-label={user?.email ? `My account, ${user.email}` : "My account"}
          aria-expanded={open}
          aria-haspopup="dialog"
          title={user?.email ?? undefined}
          className={cn(
            "inline-flex size-12 shrink-0 touch-manipulation items-center justify-center rounded-full p-0! text-ink",
            "sm:h-auto sm:min-h-10 sm:w-auto sm:max-w-[min(46vw,13rem)] sm:justify-start sm:gap-2 sm:px-2.5! sm:py-2"
          )}
        >
          {/*
            The avatar is the trigger on mobile.
            
            This button used to contain nothing but the `sm:inline` email span,
            so below `sm` it rendered as an empty circle — a control that was
            present, focusable and completely invisible. The face is what makes
            it findable at a glance, and it stays on at every width because the
            email beside it is truncated to a few characters on a narrow header
            anyway.
          */}
          <UserAvatar
            id={user?.id}
            name={user?.name ?? user?.email ?? "Account"}
            src={user?.avatar_url}
            size="md"
            className="sm:size-8"
          />
          <span className="hidden min-w-0 flex-1 truncate text-left text-base font-medium text-ink sm:inline">
            {user?.email}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,21rem)]"
      >
        <div className="px-4 pb-2">
          <p className="text-lg font-semibold text-ink">My account</p>
          <p className="mt-0.5 truncate text-base text-ink-soft">
            {user?.email}
          </p>
        </div>
        <nav aria-label="Account" className="flex flex-col gap-0.5">
          {ACCOUNT_MENU_LINKS.map(({ label, to }) => (
            <Link key={to} to={to} className={itemClass} onClick={close}>
              {label}
            </Link>
          ))}
          <button
            type="button"
            disabled={signingOut}
            className={cn(
              itemClass,
              "mt-1 text-destructive disabled:opacity-50"
            )}
            onClick={() => {
              void onSignOut()
              close()
            }}
          >
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </nav>
      </PopoverContent>
    </Popover>
  )
}
