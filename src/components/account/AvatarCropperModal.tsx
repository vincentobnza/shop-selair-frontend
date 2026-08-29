import { useCallback, useState } from "react"
import Cropper from "react-easy-crop"
import {
  ArrowClockwiseIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cropToBlob, type CropArea } from "@/lib/crop-image"

const MIN_ZOOM = 1
const MAX_ZOOM = 3

type AvatarCropperModalProps = {
  /** Object URL of the picked file. Null closes the modal. */
  imageSrc: string | null
  onCancel: () => void
  onConfirm: (blob: Blob) => Promise<void> | void
  saving?: boolean
}

/**
 * Crop a picked photo to a square before it is uploaded.
 *
 * Cropping client-side means what the user framed in the circle is exactly what
 * gets stored — the server never has to guess a focal point — and a 12MP phone
 * photo leaves the device as a 512px JPEG instead of several megabytes.
 *
 * The crop box is round because every place the avatar appears is round.
 * Showing a square selection for a circular result is a small lie that costs
 * people a retry when their chin gets clipped.
 */
export function AvatarCropperModal({
  imageSrc,
  onCancel,
  onConfirm,
  saving = false,
}: AvatarCropperModalProps) {
  return (
    <Dialog
      open={Boolean(imageSrc)}
      onOpenChange={(open) => {
        if (!open && !saving) {
          onCancel()
        }
      }}
    >
      <DialogContent className="max-w-lg p-0!">
        {imageSrc ? (
          /*
            Keyed on the picture, so choosing a different photo mounts a fresh
            editor with fresh zoom and rotation. Carrying the last photo's
            framing over looks like a bug, and clearing it from an effect costs
            an extra render pass every time the dialog opens.
          */
          <CropperBody
            key={imageSrc}
            imageSrc={imageSrc}
            onCancel={onCancel}
            onConfirm={onConfirm}
            saving={saving}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function CropperBody({
  imageSrc,
  onCancel,
  onConfirm,
  saving,
}: {
  imageSrc: string
  onCancel: () => void
  onConfirm: (blob: Blob) => Promise<void> | void
  saving: boolean
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [area, setArea] = useState<CropArea | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onCropComplete = useCallback(
    (_percent: unknown, pixels: CropArea) => setArea(pixels),
    []
  )

  async function confirm() {
    if (!area) {
      return
    }
    try {
      setError(null)
      const blob = await cropToBlob(imageSrc, area, rotation)
      await onConfirm(blob)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
    }
  }

  return (
    <>
      <div className="px-6 pt-6">
        <DialogTitle className="text-xl font-medium tracking-tight text-ink">
          Position your photo
        </DialogTitle>
        <DialogDescription className="mt-1 text-base text-ink-soft">
          Drag to move, and use the slider to zoom.
        </DialogDescription>
      </div>

      {/*
          A fixed-height stage: the cropper needs a positioned parent with real
          dimensions, and a stable one stops the dialog jumping between a
          portrait and a landscape photo.
        */}
      <div className="relative mt-5 h-86 w-full bg-ink/90">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          showGrid={false}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center gap-3">
          <MagnifyingGlassMinusIcon
            className="size-4 shrink-0 text-ink-soft"
            aria-hidden
          />
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-pink-light accent-ink"
          />
          <MagnifyingGlassPlusIcon
            className="size-4 shrink-0 text-ink-soft"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            aria-label="Rotate 90 degrees"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-pink-light hover:text-ink"
          >
            <ArrowClockwiseIcon className="size-4" aria-hidden />
          </button>
        </div>

        {error ? (
          <p role="alert" className="mt-4 text-base text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="pill"
            onClick={() => void confirm()}
            disabled={saving || !area}
            className="flex-1"
          >
            {saving ? "Saving…" : "Save photo"}
          </Button>
        </div>
      </div>
    </>
  )
}
