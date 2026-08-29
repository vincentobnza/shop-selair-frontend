import { useState } from "react"

import { avatarUrl, initialsOf } from "@/lib/avatar"
import { cn } from "@/lib/utils"

const SIZES = {
  xs: "size-7 text-[0.65rem]",
  sm: "size-8 text-[0.7rem]",
  md: "size-10 text-base",
  lg: "size-14 text-xl",
} as const

export type UserAvatarProps = {
  /** Opaque account id — this is the DiceBear seed. Never pass an email. */
  id: string | null | undefined
  /** Used for the initials underneath and for the accessible name. */
  name: string
  size?: keyof typeof SIZES
  className?: string
}

/**
 * A user's default profile picture.
 *
 * Initials are painted first and the generated face sits on top, so there is
 * never an empty circle: not while the request is in flight, not if the CDN is
 * blocked, and not for an account with no id yet. If the image fails, it is
 * removed and the initials simply remain.
 *
 * The whole thing is `aria-hidden` because every place it appears the person's
 * name is already beside it — announcing it again would just make a screen
 * reader say the name twice.
 */
export function UserAvatar({
  id,
  name,
  size = "md",
  className,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false)
  const src = avatarUrl(id)

  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-pink-light font-semibold text-ink",
        SIZES[size],
        className
      )}
    >
      {initialsOf(name)}

      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </span>
  )
}
