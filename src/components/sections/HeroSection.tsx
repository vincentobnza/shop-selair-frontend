import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useEmblaCarousel from "embla-carousel-react"
import {
  CaretLeftIcon,
  CaretRightIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { HERO_SLIDES } from "@/dummy/sampleData"
import { cn } from "@/lib/utils"

const AUTOPLAY_MS = 6500

/**
 * Full-bleed hero carousel: a wide panel carrying the overlay copy plus a
 * narrow companion panel from `lg` up, with edge chevrons, a play/pause control
 * and dot pagination — the layout used in DESIGN_REFERENCE/home.png.
 *
 * Autoplay is implemented here rather than via the embla autoplay plugin so it
 * can honour `prefers-reduced-motion` and stop permanently once the visitor
 * takes control.
 */
export function HeroSection() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true })
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!embla) return
    const onSelect = () => setSelected(embla.selectedScrollSnap())
    onSelect()
    embla.on("select", onSelect)
    return () => {
      embla.off("select", onSelect)
    }
  }, [embla])

  useEffect(() => {
    if (!embla || !playing) return
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const id = window.setInterval(() => embla.scrollNext(), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [embla, playing])

  /* Any manual navigation means the visitor is driving — stop moving under them. */
  const stopAutoplay = useCallback(() => setPlaying(false), [])

  const scrollPrev = useCallback(() => {
    stopAutoplay()
    embla?.scrollPrev()
  }, [embla, stopAutoplay])

  const scrollNext = useCallback(() => {
    stopAutoplay()
    embla?.scrollNext()
  }, [embla, stopAutoplay])

  return (
    <section aria-label="Featured collections" className="bg-paper">
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className="min-w-0 shrink-0 grow-0 basis-full"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${HERO_SLIDES.length}`}
              >
                <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <div className="relative min-w-0">
                    <AppImage
                      src={slide.image}
                      alt={slide.imageAlt}
                      priority={i === 0}
                      className="h-[62vh] max-h-[38rem] min-h-[24rem] w-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/15"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                      <h2 className="max-w-2xl font-heading text-3xl leading-tight font-medium text-white drop-shadow-sm sm:text-5xl lg:text-[3.25rem]">
                        {slide.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-base text-white">
                        {slide.subtitle}
                      </p>
                      <Button
                        variant="pill"
                        asChild
                        className="mt-6 h-11 px-8 text-base font-semibold"
                      >
                        <Link to={slide.ctaTo}>{slide.ctaLabel}</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="hidden min-w-0 lg:block">
                    <AppImage
                      src={slide.sideImage}
                      alt={slide.sideImageAlt}
                      className="h-[62vh] max-h-[38rem] min-h-[24rem] w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/75 text-ink backdrop-blur-sm transition hover:bg-white sm:left-5"
        >
          <CaretLeftIcon size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next slide"
          className="absolute top-1/2 right-3 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/75 text-ink backdrop-blur-sm transition hover:bg-white sm:right-5"
        >
          <CaretRightIcon size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="absolute right-3 bottom-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/75 text-ink backdrop-blur-sm transition hover:bg-white sm:right-5 sm:bottom-5"
        >
          {playing ? (
            <PauseIcon size={14} weight="fill" />
          ) : (
            <PlayIcon size={14} weight="fill" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-center gap-2.5 py-5">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === selected}
            onClick={() => {
              stopAutoplay()
              embla?.scrollTo(i)
            }}
            className={cn(
              "size-2 cursor-pointer rounded-full transition-colors",
              i === selected ? "bg-brand" : "bg-line"
            )}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSection
