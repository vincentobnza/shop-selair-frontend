import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowsInIcon,
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  XIcon,
} from "@phosphor-icons/react"
import { AppImage } from "@/components/ui/app-image"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"

const MIN_SCALE = 1
const MAX_SCALE = 4
/** Multiplier for one press of the zoom buttons or the +/- keys. */
const ZOOM_STEP = 1.6
/** Where a double-click or double-tap lands from rest. */
const QUICK_ZOOM = 2.4
/** Horizontal travel that counts as a swipe between photos, in CSS pixels. */
const SWIPE_THRESHOLD = 56
/** Downward travel that dismisses the sheet, in CSS pixels. */
const DISMISS_THRESHOLD = 96
/** Arrow-key pan distance while zoomed in, in CSS pixels. */
const KEY_PAN_STEP = 64
/** Longest gap between two taps that still reads as a double-tap, in ms. */
const DOUBLE_TAP_MS = 300

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

const controlClass = cn(
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full",
  "text-ink transition-colors hover:bg-pink-light",
  "focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
  "disabled:pointer-events-none disabled:opacity-35"
)

export type ProductImageViewerProps = {
  images: string[]
  productName: string
  /** Index of the open photo. `null` closes the sheet. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Focus returns here on close — the photo that opened the sheet. */
  restoreFocusRef?: React.RefObject<HTMLElement | null>
}

/**
 * Photo zoom sheet.
 *
 * The half of product zoom that works everywhere: wheel and pinch to zoom,
 * drag to pan, double-click or double-tap to jump in and out, swipe or arrow
 * keys to move between photos, and a swipe down or Escape to leave. The hover
 * loupe in `ZoomLensImage` is the quick look; this is the considered one, and
 * the only one a touch or keyboard visitor can reach.
 *
 * It rises as a bottom sheet, like the rental date picker and the bag — the
 * house pattern for anything that takes over the screen, rather than a second
 * overlay language for one feature.
 */
export function ProductImageViewer({
  images,
  productName,
  index,
  onIndexChange,
  onClose,
  restoreFocusRef,
}: ProductImageViewerProps) {
  const open = index !== null && images.length > 0

  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  /*
   * Move focus into the sheet, and put it back where it came from on close, so
   * a keyboard visitor is not left tabbing the page behind the overlay. The
   * photo that opened it is preferred over `document.activeElement`, since a
   * mouse click does not focus a button in every browser.
   */
  useEffect(() => {
    if (!open) return

    returnFocusRef.current =
      restoreFocusRef?.current ?? (document.activeElement as HTMLElement | null)
    const focusTimer = window.setTimeout(
      () => closeButtonRef.current?.focus(),
      0
    )

    return () => {
      window.clearTimeout(focusTimer)
      const previous = returnFocusRef.current
      if (previous && document.contains(previous)) previous.focus()
    }
  }, [open, restoreFocusRef])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {index !== null && images.length > 0 ? (
        <>
          <motion.button
            type="button"
            aria-label="Close photo viewer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-99 bg-black/50"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} photos`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 bottom-0 z-99 flex h-[92svh] flex-col rounded-t-[1.75rem] bg-white sm:mx-auto sm:max-w-4xl"
          >
            {/* Grab handle — the usual affordance for a sheet. */}
            <span
              aria-hidden
              className="mx-auto mt-3 block h-1 w-12 shrink-0 rounded-full bg-pink"
            />

            <ViewerStage
              images={images}
              productName={productName}
              activeIndex={index}
              onIndexChange={onIndexChange}
              onClose={onClose}
              closeButtonRef={closeButtonRef}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

type ViewerStageProps = {
  images: string[]
  productName: string
  activeIndex: number
  onIndexChange: (index: number) => void
  onClose: () => void
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
}

function ViewerStage({
  images,
  productName,
  activeIndex,
  onIndexChange,
  onClose,
  closeButtonRef,
}: ViewerStageProps) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  const stageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  /*
   * The transform lives in a ref and is written straight to the element. A pan
   * or a pinch produces a value every frame, and routing those through state
   * would re-render this tree sixty times a second to set one style. Only the
   * two facts the chrome needs — whether zooming in or out is still possible —
   * are mirrored into state, and only when they change.
   */
  const viewRef = useRef({ scale: MIN_SCALE, x: 0, y: 0 })
  const [zoomedIn, setZoomedIn] = useState(false)
  const [atMaxZoom, setAtMaxZoom] = useState(false)

  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null)
  const panRef = useRef<{
    originX: number
    originY: number
    startX: number
    startY: number
    moved: boolean
  } | null>(null)
  const lastTapRef = useRef(0)

  const count = images.length
  const src = images[activeIndex]

  const apply = useCallback(
    (animate: boolean) => {
      const image = imageRef.current
      if (!image) return

      const { scale, x, y } = viewRef.current
      image.style.transition =
        animate && !reduceMotion
          ? "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "none"
      image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

      setZoomedIn(scale > MIN_SCALE + 0.01)
      setAtMaxZoom(scale > MAX_SCALE - 0.01)
    },
    [reduceMotion]
  )

  /** Keeps the photo from being dragged off the stage entirely. */
  const clampOffsets = useCallback(() => {
    const image = imageRef.current
    const stage = stageRef.current
    if (!image || !stage) return

    const view = viewRef.current
    /* max-width/max-height keep the layout box equal to the painted box, so
       these are the real overhang of the photo past the stage. */
    const overhangX = Math.max(
      0,
      (image.offsetWidth * view.scale - stage.clientWidth) / 2
    )
    const overhangY = Math.max(
      0,
      (image.offsetHeight * view.scale - stage.clientHeight) / 2
    )
    view.x = clamp(view.x, -overhangX, overhangX)
    view.y = clamp(view.y, -overhangY, overhangY)
  }, [])

  /**
   * Scales towards a point — the cursor, the pinch midpoint, or the centre of
   * the stage — so whatever is under it stays under it.
   */
  const zoomTo = useCallback(
    (nextScale: number, origin?: { x: number; y: number }, animate = true) => {
      const stage = stageRef.current
      if (!stage) return

      const rect = stage.getBoundingClientRect()
      const centreX = rect.left + rect.width / 2
      const centreY = rect.top + rect.height / 2
      const anchorX = (origin?.x ?? centreX) - centreX
      const anchorY = (origin?.y ?? centreY) - centreY

      const view = viewRef.current
      const target = clamp(nextScale, MIN_SCALE, MAX_SCALE)
      const ratio = target / view.scale

      view.x = anchorX - (anchorX - view.x) * ratio
      view.y = anchorY - (anchorY - view.y) * ratio
      view.scale = target
      if (target === MIN_SCALE) {
        view.x = 0
        view.y = 0
      }

      clampOffsets()
      apply(animate)
    },
    [apply, clampOffsets]
  )

  const resetView = useCallback(
    (animate = true) => {
      viewRef.current = { scale: MIN_SCALE, x: 0, y: 0 }
      apply(animate)
    },
    [apply]
  )

  const step = useCallback(
    (delta: number) => {
      if (count < 2) return
      onIndexChange((activeIndex + delta + count) % count)
    },
    [activeIndex, count, onIndexChange]
  )

  /* A new photo always starts fitted, never inheriting the last one's zoom. */
  useEffect(() => {
    resetView(false)
  }, [activeIndex, resetView])

  /* The next photo is one arrow press away; fetch it before it is asked for. */
  useEffect(() => {
    if (count < 2) return
    for (const offset of [1, -1]) {
      const preload = new Image()
      preload.src = images[(activeIndex + offset + count) % count]
    }
  }, [activeIndex, count, images])

  /*
   * Wheel is bound by hand because the handler calls preventDefault, and React
   * attaches wheel listeners passively — where preventDefault does nothing.
   */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      /* Exponential so a fast scroll and several slow ones agree, and so the
         step is symmetric: zooming in then out returns to where it began. */
      const factor = Math.exp(-event.deltaY * 0.0022)
      zoomTo(
        viewRef.current.scale * factor,
        { x: event.clientX, y: event.clientY },
        false
      )
    }

    stage.addEventListener("wheel", handleWheel, { passive: false })
    return () => stage.removeEventListener("wheel", handleWheel)
  }, [zoomTo])

  const endPointer = useCallback((pointerId: number) => {
    pointersRef.current.delete(pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
  }, [])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const pointers = pointersRef.current
      event.currentTarget.setPointerCapture(event.pointerId)
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinchRef.current = {
          distance: Math.hypot(a.x - b.x, a.y - b.y),
          scale: viewRef.current.scale,
        }
        panRef.current = null
        return
      }

      panRef.current = {
        originX: viewRef.current.x,
        originY: viewRef.current.y,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      }
    },
    []
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const pointers = pointersRef.current
      if (!pointers.has(event.pointerId)) return
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

      const pinch = pinchRef.current
      if (pinch && pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        const distance = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinch.distance > 0) {
          zoomTo(
            pinch.scale * (distance / pinch.distance),
            { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
            false
          )
        }
        return
      }

      const pan = panRef.current
      if (!pan) return

      const dx = event.clientX - pan.startX
      const dy = event.clientY - pan.startY
      if (!pan.moved && Math.hypot(dx, dy) > 4) pan.moved = true

      /* At rest a drag is a swipe — between photos, or down to dismiss the
         sheet — and both are resolved on release. */
      if (viewRef.current.scale <= MIN_SCALE) return

      viewRef.current.x = pan.originX + dx
      viewRef.current.y = pan.originY + dy
      clampOffsets()
      apply(false)
    },
    [apply, clampOffsets, zoomTo]
  )

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      endPointer(event.pointerId)

      const pan = panRef.current
      panRef.current = null
      if (!pan) return

      const dx = event.clientX - pan.startX
      const dy = event.clientY - pan.startY

      if (viewRef.current.scale <= MIN_SCALE) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) > SWIPE_THRESHOLD) {
            step(dx < 0 ? 1 : -1)
            return
          }
        } else if (dy > DISMISS_THRESHOLD) {
          /* Pull the sheet down to put it away, as with every other sheet. */
          onClose()
          return
        }
      }

      if (pan.moved) return

      /* Mouse double-clicks arrive as onDoubleClick; touch has no such event,
         so a second tap inside the window counts as one here. */
      if (event.pointerType !== "mouse") {
        const now = performance.now()
        if (now - lastTapRef.current < DOUBLE_TAP_MS) {
          lastTapRef.current = 0
          zoomTo(viewRef.current.scale > MIN_SCALE ? MIN_SCALE : QUICK_ZOOM, {
            x: event.clientX,
            y: event.clientY,
          })
        } else {
          lastTapRef.current = now
        }
      }
    },
    [endPointer, onClose, step, zoomTo]
  )

  const panBy = useCallback(
    (dx: number, dy: number) => {
      viewRef.current.x += dx
      viewRef.current.y += dy
      clampOffsets()
      apply(true)
    },
    [apply, clampOffsets]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const zoomed = viewRef.current.scale > MIN_SCALE

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          if (zoomed) panBy(KEY_PAN_STEP, 0)
          else step(-1)
          break
        case "ArrowRight":
          event.preventDefault()
          if (zoomed) panBy(-KEY_PAN_STEP, 0)
          else step(1)
          break
        case "ArrowUp":
          if (!zoomed) return
          event.preventDefault()
          panBy(0, KEY_PAN_STEP)
          break
        case "ArrowDown":
          if (!zoomed) return
          event.preventDefault()
          panBy(0, -KEY_PAN_STEP)
          break
        case "+":
        case "=":
          event.preventDefault()
          zoomTo(viewRef.current.scale * ZOOM_STEP)
          break
        case "-":
        case "_":
          event.preventDefault()
          zoomTo(viewRef.current.scale / ZOOM_STEP)
          break
        case "0":
          event.preventDefault()
          resetView()
          break
        default:
          break
      }
    },
    [panBy, resetView, step, zoomTo]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col" onKeyDown={handleKeyDown}>
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 pt-3 pb-2 sm:px-6">
        <div className="min-w-0">
          <h2 className="truncate font-heading text-xl font-medium text-ink">
            {productName}
          </h2>
          {count > 1 ? (
            <p className="text-base text-ink-soft">
              Photo {activeIndex + 1} of {count}
            </p>
          ) : null}
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className={controlClass}
          aria-label="Close photo viewer"
        >
          <XIcon size={20} weight="bold" aria-hidden />
        </button>
      </header>

      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(event) => {
          endPointer(event.pointerId)
          panRef.current = null
        }}
        onDoubleClick={(event) =>
          zoomTo(viewRef.current.scale > MIN_SCALE ? MIN_SCALE : QUICK_ZOOM, {
            x: event.clientX,
            y: event.clientY,
          })
        }
        className="relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden bg-pink-light"
      >
        <AppImage
          ref={imageRef}
          key={src}
          src={src}
          alt={
            count > 1
              ? `${productName}, photo ${activeIndex + 1} of ${count}`
              : productName
          }
          priority
          draggable={false}
          onLoad={() => {
            /* A taller or wider photo changes what counts as overhang. */
            clampOffsets()
            apply(false)
          }}
          className={cn(
            "max-h-full max-w-full origin-center object-contain select-none",
            zoomedIn ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          )}
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className={cn(
                controlClass,
                "absolute top-1/2 left-2 -translate-y-1/2 bg-white/85 shadow-[0_6px_18px_-8px_rgb(45_45_45/0.6)] hover:bg-white sm:left-4"
              )}
            >
              <CaretLeftIcon size={20} weight="bold" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className={cn(
                controlClass,
                "absolute top-1/2 right-2 -translate-y-1/2 bg-white/85 shadow-[0_6px_18px_-8px_rgb(45_45_45/0.6)] hover:bg-white sm:right-4"
              )}
            >
              <CaretRightIcon size={20} weight="bold" aria-hidden />
            </button>
          </>
        ) : null}

        {/* Zoom controls float over the photo rather than crowding the header,
            which on a narrow phone has room for a title and one button. */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/90 p-1 shadow-[0_10px_30px_-12px_rgb(45_45_45/0.7)] backdrop-blur-sm">
          <button
            type="button"
            className={cn(controlClass, "size-10")}
            disabled={!zoomedIn}
            onClick={() => zoomTo(viewRef.current.scale / ZOOM_STEP)}
            aria-label="Zoom out"
          >
            <MagnifyingGlassMinusIcon size={18} aria-hidden />
          </button>
          <button
            type="button"
            className={cn(controlClass, "size-10")}
            disabled={!zoomedIn}
            onClick={() => resetView()}
            aria-label="Fit photo to screen"
          >
            <ArrowsInIcon size={18} aria-hidden />
          </button>
          <button
            type="button"
            className={cn(controlClass, "size-10")}
            disabled={atMaxZoom}
            onClick={() => zoomTo(viewRef.current.scale * ZOOM_STEP)}
            aria-label="Zoom in"
          >
            <MagnifyingGlassPlusIcon size={18} aria-hidden />
          </button>
        </div>
      </div>

      {count > 1 ? (
        <nav
          aria-label={`${productName} photos`}
          className="flex shrink-0 justify-center gap-2 px-4 pt-3"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          {images.map((thumb, i) => (
            <button
              key={`${thumb}-${i}`}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className={cn(
                "h-16 w-12 cursor-pointer overflow-hidden rounded-sm bg-pink-light transition sm:h-20 sm:w-15",
                "focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
                i === activeIndex
                  ? "ring-2 ring-brand"
                  : "opacity-60 ring-1 ring-line hover:opacity-100"
              )}
            >
              <AppImage
                src={thumb}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </nav>
      ) : (
        <div
          className="shrink-0"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        />
      )}
    </div>
  )
}
