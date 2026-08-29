import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react"

import {
  categoryNavItems,
  occasionNavItems,
  SITE_LOGO_TEXT,
  utilityLinks,
} from "@/components/layout/nav-config"
import { AppImage } from "@/components/ui/app-image"
import { EDITORIAL_TILES } from "@/dummy/sampleData"
import { cn } from "@/lib/utils"

type SectionId = "collections" | "occasions"

const SECTIONS: Record<
  SectionId,
  { title: string; items: typeof categoryNavItems; feature: number }
> = {
  collections: { title: "Collections", items: categoryNavItems, feature: 1 },
  occasions: { title: "Occasions", items: occasionNavItems, feature: 2 },
}

const FLAT_LINKS = [
  utilityLinks.howItWorks,
  utilityLinks.fittings,
  { label: "FAQs", href: "/#faq" },
] as const

/** Drill-down slides in from the trailing edge; going back reverses it. */
const PANEL_MOTION = {
  initial: (direction: number) => ({ x: direction * 32, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -32, opacity: 0 }),
}

type BrowseDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Left-hand navigation drawer opened by "Browse" (and by the hamburger on
 * small screens). One panel serves both breakpoints, and a single drill-down
 * level keeps the whole catalog two taps away.
 *
 * Rows follow the overlay concept: no separators, pill hover, body-sized text.
 */
export function BrowseDrawer({ open, onOpenChange }: BrowseDrawerProps) {
  const [section, setSection] = useState<SectionId | null>(null)
  /* 1 while drilling in, -1 while going back — drives the slide direction. */
  const [direction, setDirection] = useState(1)

  const openSection = (id: SectionId) => {
    setDirection(1)
    setSection(id)
  }
  const goBack = () => {
    setDirection(-1)
    setSection(null)
  }

  /* Escape closes; the page behind must not scroll while the drawer is up. */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onOpenChange])

  /* Reopening always starts at the top level rather than where you left off. */
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setSection(null)
      setDirection(1)
    }
  }

  const close = () => onOpenChange(false)
  const active = section ? SECTIONS[section] : null
  const feature = EDITORIAL_TILES[active ? active.feature : 0]

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close browse menu"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-99 bg-black/30"
          />

          <motion.aside
            id="browse-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Browse"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.26 }}
            className="fixed top-0 left-0 z-99 flex h-svh w-full max-w-[26rem] flex-col bg-white"
          >
            <header className="flex items-center justify-between gap-2 px-4 py-4">
              {active ? (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Back to browse"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full text-brand transition-colors hover:bg-pink-light"
                >
                  <CaretLeftIcon size={20} weight="bold" />
                </button>
              ) : (
                <span className="size-11" aria-hidden />
              )}

              {active ? (
                <h2 className="min-w-0 flex-1 truncate text-center text-lg font-medium text-ink">
                  {active.title}
                </h2>
              ) : (
                <Link
                  to="/"
                  onClick={close}
                  className="min-w-0 flex-1 truncate text-center font-logo text-2xl leading-none font-bold tracking-[-0.04em] text-ink"
                >
                  {SITE_LOGO_TEXT.toLowerCase()}
                </Link>
              )}

              <button
                type="button"
                onClick={close}
                aria-label="Close browse menu"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full text-brand transition-colors hover:bg-pink-light"
              >
                <XIcon size={22} weight="bold" />
              </button>
            </header>

            <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={section ?? "root"}
                  custom={direction}
                  variants={PANEL_MOTION}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Link
                    to={feature.to}
                    onClick={close}
                    className="relative block overflow-hidden rounded-2xl"
                  >
                    <AppImage
                      src={feature.image}
                      alt={feature.alt}
                      className="h-40 w-full object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent"
                    />
                    <span className="absolute bottom-4 left-5 text-lg font-semibold text-white drop-shadow-sm">
                      {feature.label}
                    </span>
                  </Link>

                  <nav
                    aria-label={active ? active.title : "Browse"}
                    className="mt-4 flex flex-col gap-0.5"
                  >
                    {active ? (
                      active.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={close}
                          className="overlay-item"
                        >
                          {item.label}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link
                          to="/shop"
                          onClick={close}
                          className="overlay-item"
                        >
                          View all pieces
                        </Link>

                        {(Object.keys(SECTIONS) as SectionId[]).map((id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => openSection(id)}
                            className={cn("overlay-item", "justify-between")}
                          >
                            {SECTIONS[id].title}
                            <CaretRightIcon
                              size={16}
                              weight="bold"
                              aria-hidden
                              className="text-brand"
                            />
                          </button>
                        ))}

                        {FLAT_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={close}
                            className="overlay-item"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </>
                    )}
                  </nav>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
