import { useState } from "react"

import { fileUrl } from "@/lib/api-base"
import { avatarUrl, initialsOf } from "@/lib/avatar"
import { cn } from "@/lib/utils"

const SIZES = {
  xs: "size-7 text-[0.65rem]",
  sm: "size-8 text-[0.7rem]",
  md: "size-10 text-base",
  lg: "size-14 text-xl",
  xl: "size-20 text-2xl",
} as const

export type UserAvatarProps = {
  /** Opaque account id — this is the DiceBear seed. Never pass an email. */
  id: string | null | undefined
  /** Used for the initials underneath and for the accessible name. */
  name: string
  /**
   * An uploaded picture. When present it wins over the generated avatar — a
   * face someone chose beats one we invented for them.
   */
  src?: string | null
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
  src,
  size = "md",
  className,
}: UserAvatarProps) {
  /*
   * Which URL failed, rather than a boolean.
   *
   * A flag would have to be reset whenever the picture changes, and resetting
   * state from an effect costs an extra render pass. Storing the URL makes the
   * comparison below self-correcting: a new upload simply is not the one that
   * failed, so it is attempted without anything having to clear a flag.
   */
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  /*
   * An uploaded picture first, a generated face second, initials last.
   *
   * Stored avatars come back as API-relative paths, so they go through
   * `fileUrl` to reach the right origin. It passes absolute URLs — including
   * the DiceBear one — through untouched.
   */
  const resolved = src ? fileUrl(src) : avatarUrl(id)

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

      {resolved && resolved !== failedSrc ? (
        <img
          src={resolved}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(resolved)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </span>
  )
}
