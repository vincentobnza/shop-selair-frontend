import { useEffect, useRef, useState } from "react"
import { CameraIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { AvatarCropperModal } from "@/components/account/AvatarCropperModal"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { toUserMessage } from "@/features/auth/errors"
import { useAuthStore } from "@/features/auth/store"
import { removeAvatar, uploadAvatar } from "@/features/users/api"

/** Refused before anything is read, so a huge file never hits memory. */
const MAX_PICK_BYTES = 10 * 1024 * 1024
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"]

type AvatarPickerProps = {
  id: string | null | undefined
  name: string
  avatarUrl: string | null | undefined
}

/**
 * The profile picture control: current avatar, change, remove.
 *
 * Picking a file opens the cropper rather than uploading immediately — the
 * upload only happens once someone has framed the shot and pressed save, so a
 * mis-picked photo costs a cancel instead of a round trip and a second upload.
 */
export function AvatarPicker({ id, name, avatarUrl }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Object URLs are a memory leak if they are never revoked.
  useEffect(() => {
    return () => {
      if (picked) {
        URL.revokeObjectURL(picked)
      }
    }
  }, [picked])

  function closeCropper() {
    if (picked) {
      URL.revokeObjectURL(picked)
    }
    setPicked(null)
  }

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset immediately so picking the *same* file again still fires a change.
    event.target.value = ""

    if (!file) {
      return
    }
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please choose a JPG, PNG or WebP image.")
      return
    }
    if (file.size > MAX_PICK_BYTES) {
      toast.error("That image is too large. Please choose one under 10MB.")
      return
    }

    setPicked(URL.createObjectURL(file))
  }

  async function save(blob: Blob) {
    setSaving(true)
    try {
      const updated = await uploadAvatar(blob)
      useAuthStore.setState((state) => ({
        user: state.user
          ? { ...state.user, avatar_url: updated.avatar_url }
          : state.user,
      }))
      closeCropper()
      toast.success("Profile picture updated.")
    } catch (error) {
      toast.error(toUserMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function clear() {
    setSaving(true)
    try {
      await removeAvatar()
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, avatar_url: null } : state.user,
      }))
      toast.success("Profile picture removed.")
    } catch (error) {
      toast.error(toUserMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Stacked on a small phone: side by side, the avatar and the gap leave
          the buttons about 110px, and "Upload photo" cannot shrink that far. */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="relative">
          <UserAvatar id={id} name={name} src={avatarUrl} size="xl" />
          {/*
            The camera badge is decoration on top of the real button below —
            it is aria-hidden so a screen reader gets one clear control, not
            two that do the same thing.
          */}
          <span
            aria-hidden
            className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-ink text-white ring-2 ring-white"
          >
            <CameraIcon className="size-3.5" weight="fill" />
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-base font-medium text-ink">Profile picture</p>
          <p className="mt-0.5 text-base text-ink-soft">
            JPG, PNG or WebP. We’ll crop it to a square.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => inputRef.current?.click()}
              className="rounded-full"
            >
              {avatarUrl ? "Change photo" : "Upload photo"}
            </Button>

            {avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={saving}
                onClick={() => void clear()}
                className="rounded-full text-ink-soft hover:text-ink"
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={onPick}
        className="sr-only"
        aria-label="Choose a profile picture"
      />

      <AvatarCropperModal
        imageSrc={picked}
        saving={saving}
        onCancel={closeCropper}
        onConfirm={save}
      />
    </>
  )
}
