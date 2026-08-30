import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { differenceInCalendarDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { ArrowLeftIcon, CoatHangerIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { ProductCard } from "@/components/ProductCard"
import { ProductSizePicker } from "@/components/ProductSizePicker"
import { ReservationCalendar } from "@/components/ReservationCalendar"
import { ProductDescription } from "@/components/product/ProductDescription"
import { ReviewsSection } from "@/components/product/ReviewsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { PlanSection } from "@/components/sections/PlanSection"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AppImage } from "@/components/ui/app-image"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { BRAND, SERVICE_PROMISES } from "@/config/brand"
import { buildTitle, DEFAULT_DESCRIPTION } from "@/config/site"
import { toUserMessage } from "@/features/auth/errors"
import { useCartStore } from "@/features/cart/cartStore"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { formatDate } from "@/lib/dates"
import { useCartUiStore } from "@/features/cart/cartUiStore"
import { useFavorite } from "@/features/favorites/useFavorite"
import { slugifyProductName } from "@/features/products/map"
import { useCatalogProducts } from "@/features/products/queries"
import type { CatalogProduct } from "@/features/products/types"
import { cn } from "@/lib/utils"

const currencyFormatter = new Intl.NumberFormat(BRAND.locale, {
  style: "currency",
  currency: BRAND.currency,
  maximumFractionDigits: 0,
})

/** Scroll travel that counts as a direction change, in CSS pixels. */
const SCROLL_INTENT = 8
/** Below this the bar always shows, so a bounce at the top cannot hide it. */
const SCROLL_REVEAL_FLOOR = 24

function formatDateForURL(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/**
 * Product imagery: a two-up mosaic from `sm` up, matching the reference product
 * page. On phones the same markup becomes a horizontal snap gallery instead of
 * a stack, so the size picker and the reserve button stay within a screen or
 * two of the fold rather than sitting below several full-height photos.
 */
function ProductImageMosaic({ product }: { product: CatalogProduct }) {
  const images = product.image.filter(Boolean).slice(0, 4)

  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  /*
   * The dots read the strip rather than drive it. The gallery is a native
   * scroll-snap track, so the finger stays the source of truth and the
   * indicator is derived from the scroll offset. React drops the update when
   * the rounded index has not changed, so a swipe costs one render per photo
   * rather than one per frame.
   */
  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return

    const index = Math.round(track.scrollLeft / track.clientWidth)
    /* Overscroll bounce reports past either end on iOS. */
    setActiveIndex(Math.min(Math.max(index, 0), track.children.length - 1))
  }, [])

  if (images.length === 0) {
    return <div className="aspect-3/4 w-full bg-pink-light" />
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        aria-label={`${product.name}, ${images.length} ${images.length === 1 ? "photo" : "photos"}`}
        className="no-scrollbar flex snap-x snap-mandatory gap-px overflow-x-auto bg-line sm:grid sm:grid-cols-2 sm:overflow-visible"
      >
        {images.map((src, i) => {
          /* An odd trailing image spans the full width rather than leaving a
           hole in the grid, so a 1- or 3-image product still reads as a set. */
          const spansFullWidth =
            images.length % 2 === 1 && i === images.length - 1

          return (
            <div
              key={`${src}-${i}`}
              className={cn(
                "w-full shrink-0 snap-start bg-pink-light sm:w-auto",
                spansFullWidth && "sm:col-span-2"
              )}
            >
              <AppImage
                src={src}
                alt={i === 0 ? product.name : `${product.name}, view ${i + 1}`}
                priority={i === 0}
                className={cn(
                  "w-full object-cover",
                  spansFullWidth ? "aspect-3/4 sm:aspect-3/2" : "aspect-3/4"
                )}
              />
            </div>
          )
        })}
      </div>

      {/* Phones see one photo at a time, so the set needs saying out loud;
          from `sm` up the mosaic already shows every photo at once. The strip
          is decorative — the region above announces the count, and each photo
          carries its own alt text. */}
      {images.length > 1 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center sm:hidden"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-white/75 px-2 py-1.5 backdrop-blur-sm">
            {images.map((src, i) => (
              <span
                key={`dot-${src}-${i}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === activeIndex ? "w-5 bg-ink" : "w-1.5 bg-ink/30"
                )}
              />
            ))}
          </span>
        </div>
      ) : null}
    </div>
  )
}

/** The three-step service card repeated from the home page. */
function HowRentingWorksCard() {
  return (
    <section
      aria-labelledby="how-renting-works"
      className="mt-8 rounded-2xl bg-white p-6 sm:rounded-3xl"
    >
      <h2
        id="how-renting-works"
        className="text-center font-heading text-2xl font-medium text-ink"
      >
        How renting from {BRAND.name} works
      </h2>

      <ol className="mt-6 grid gap-5">
        {SERVICE_PROMISES.map((promise, i) => (
          <li key={promise.title} className="flex gap-4">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-light text-base font-semibold text-ink"
            >
              {i + 1}
            </span>
            <div>
              <p className="text-base font-semibold text-ink">
                {promise.title}
              </p>{" "}
              <p className="mt-1 text-base leading-relaxed text-ink-soft">
                {promise.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-center">
        <Link
          to="/#how-it-works"
          className="text-base font-medium text-brand underline-offset-4 hover:underline"
        >
          View full details
        </Link>
      </p>
    </section>
  )
}

type PurchasePanelProps = {
  product: CatalogProduct
  range: DateRange | undefined
  rentalDays: number
  dailyRate: number
  totalRate: number
  onRangeChange: (r: DateRange | undefined) => void
}

function ProductPurchasePanel({
  product,
  range,
  rentalDays,
  dailyRate,
  totalRate,
  onRangeChange,
}: PurchasePanelProps) {
  const addToCart = useCartStore((s) => s.addItem)
  const openCart = useCartUiStore((s) => s.openCart)
  /*
   * The button that started the add, captured while it still has focus: both
   * buttons disable themselves during the request, and a disabled button drops
   * focus to the body — so by the time the drawer opens there is nothing left
   * to hand focus back to on close.
   */
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [addingCart, setAddingCart] = useState(false)
  const [size, setSize] = useState<string | null>(null)

  /*
   * On a phone the actions leave the flow and sit over the page, so reserving
   * is one thumb away wherever the visitor has read to — the dates, the size
   * and the reviews are all a long scroll on a narrow screen.
   *
   * Nothing holds their place in the document any more, so the page reserves
   * their height at its foot instead. It is measured rather than guessed: the
   * bar is one button tall for an accessory and two for a hire, and the safe
   * area under it differs by device. Padding goes on the body because the
   * footer lives outside this page's `main`, and it is the last thing that
   * would otherwise end up underneath the bar.
   */
  const isMobile = useMediaQuery("(max-width: 639.98px)")
  const actionBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = actionBarRef.current
    if (!isMobile || !bar) return

    const previousPadding = document.body.style.paddingBottom
    const sync = () => {
      document.body.style.paddingBottom = `${bar.offsetHeight}px`
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(bar)

    return () => {
      observer.disconnect()
      document.body.style.paddingBottom = previousPadding
    }
  }, [isMobile])

  /*
   * Reading down the page — the description, the reviews, the related pieces —
   * is when the bar is in the way; scrolling back up is when someone is
   * looking for it again. So it follows the direction of travel and gives a
   * phone its bottom two centimetres back while they read.
   *
   * The listener is passive and coalesced into a frame: scroll fires far more
   * often than this needs, and only a change of direction re-renders. The
   * reserved space at the foot of the page stays reserved either way, so the
   * page does not shift as the bar comes and goes.
   */
  const [barHidden, setBarHidden] = useState(false)

  /*
   * The bar stays away until the photos are behind the visitor. Up at the top
   * the gallery is the whole point of the screen, and a bar across its foot
   * crops the piece they came to look at — so the actions wait until the
   * picture, the name and the price have scrolled past, which is also the
   * moment the question turns from "what is it?" into "shall I take it?".
   *
   * The line is drawn by a marker in the flow rather than a pixel count, so a
   * tall photo, a long name and a wrapped price all move it by themselves.
   */
  const introRef = useRef<HTMLDivElement>(null)
  const [pastIntro, setPastIntro] = useState(false)

  useEffect(() => {
    const marker = introRef.current
    if (!isMobile || !marker) return

    const observer = new IntersectionObserver(([entry]) =>
      setPastIntro(entry.boundingClientRect.top < 0)
    )
    observer.observe(marker)

    return () => observer.disconnect()
  }, [isMobile])

  /* A bar off the bottom of the screen is still tabbable; anything reaching a
     button by keyboard brings the bar with it rather than pressing it blind. */
  const [focusHeld, setFocusHeld] = useState(false)

  /*
   * Picking a size is the first committing thing anyone does on this page, so
   * from that point the actions are what they want next — the bar comes up
   * even if the photos are still on screen, and slides in straight away rather
   * than waiting for the next scroll back up.
   */
  const handleSizeChange = useCallback((label: string) => {
    setSize(label)
    setBarHidden(false)
  }, [])

  const barVisible = focusHeld || ((pastIntro || size !== null) && !barHidden)

  useEffect(() => {
    if (!isMobile) return

    let lastY = window.scrollY
    let frame = 0

    const measure = () => {
      frame = 0
      const y = Math.max(window.scrollY, 0)
      const delta = y - lastY
      /* Ignore jitter and rubber-banding, and leave `lastY` where it was so
         a slow drag still accumulates into a decision. */
      if (Math.abs(delta) < SCROLL_INTENT) return

      lastY = y
      setBarHidden(delta > 0 && y > SCROLL_REVEAL_FLOOR)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isMobile])

  const needsSize = product.sizes.length > 0

  /* Both actions share the same validation and cart call; only the date
     requirement differs, which keeps the two buttons honest about what they do. */
  const submit = useCallback(
    (requireDates: boolean) => {
      if (needsSize && !size) {
        toast.error("Please choose a size first.")
        return
      }
      if (requireDates && !range?.from) {
        toast.error("Please select a start date for your rental.")
        return
      }
      if (requireDates && !range?.to) {
        toast.error("Please select a return date to complete your rental.")
        return
      }

      /* An accessory is bought, so it never carries a hire window — even if
         dates are somehow still in the URL from a previous piece. */
      const rental =
        !product.purchaseOnly && range?.from && range?.to
          ? {
              start: formatDateForURL(range.from),
              end: formatDateForURL(range.to),
            }
          : undefined

      setAddingCart(true)
      void addToCart(String(product.id), 1, size ?? undefined, rental)
        .then(() => {
          /*
           * Show the bag rather than only announcing it. Reserving dates is the
           * moment a customer wants to see what they are holding — the piece,
           * the dates, the total — and the drawer answers all three without
           * leaving the product page. It opens only after the line is actually
           * in the bag, so it never shows a bag that does not yet contain it.
           */
          openCart(triggerRef.current)
          toast.success("Added to your bag", {
            description: rental
              ? `Held for ${formatDate(rental.start)} to ${formatDate(rental.end)}.`
              : "Add your dates at checkout to confirm the reservation.",
          })
        })
        .catch((error: unknown) => {
          toast.error(toUserMessage(error))
        })
        .finally(() => setAddingCart(false))
    },
    [
      addToCart,
      needsSize,
      openCart,
      product.id,
      product.purchaseOnly,
      range,
      size,
    ]
  )

  return (
    <>
      {/* Where the photos and the title end — see `pastIntro`. */}
      <div ref={introRef} aria-hidden className="h-px sm:hidden" />

      <ProductSizePicker
        sizes={product.sizes}
        value={size}
        onChange={handleSizeChange}
        hint={needsSize && !size}
      />

      <div className="mt-8">
        {product.purchaseOnly ? (
          <dl className="rounded-sm bg-white p-4">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-base text-ink-soft">Price</dt>
              <dd className="text-xl font-semibold text-ink">
                {currencyFormatter.format(product.price)}
              </dd>
            </div>
            <p className="mt-1 text-base text-ink-soft">
              Yours to keep — accessories are bought, not hired, so there are no
              dates to pick and nothing to send back.
            </p>
          </dl>
        ) : (
          <>
            <p className="text-base text-ink">
              <span className="font-semibold">Your dates:</span>{" "}
              <span className="text-ink-soft">
                {range?.from
                  ? `${format(range.from, "d MMM yyyy")}${
                      range.to ? ` — ${format(range.to, "d MMM yyyy")}` : ""
                    }`
                  : "Choose when you need it"}
              </span>
            </p>
            <div className="mt-3">
              <ReservationCalendar
                productId={product.id}
                range={range}
                setRange={onRangeChange}
              />
            </div>
            <dl className="mt-4 rounded-sm bg-white p-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-base text-ink-soft">
                  {currencyFormatter.format(Math.round(dailyRate))} / day
                  {rentalDays > 0
                    ? ` × ${rentalDays} day${rentalDays > 1 ? "s" : ""}`
                    : ""}
                </dt>
                <dd className="text-xl font-semibold text-ink">
                  {rentalDays > 0
                    ? currencyFormatter.format(Math.round(totalRate))
                    : currencyFormatter.format(product.price)}
                </dd>
              </div>
              {rentalDays === 0 ? (
                <p className="mt-1 text-base text-ink-soft">
                  Base rate for a {product.duration}-day rental. Pick your dates
                  to see the total.
                </p>
              ) : null}
            </dl>
          </>
        )}
      </div>

      <div className="mt-5">
        <div
          ref={actionBarRef}
          onFocusCapture={() => setFocusHeld(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setFocusHeld(false)
            }
          }}
          className={cn(
            "flex flex-col gap-2",
            /* Fixed to the foot of the screen on a phone, plain flow from
               `sm` up. One element either way, so there is never a second
               copy of the button to keep in step. It clears the chat bubble
               (z-40) but stays under the bag and the photo viewer (z-99),
               which take the whole screen when they open. */
            "rounded-t-2xl max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-50",
            "max-sm:border-t max-sm:border-line max-sm:bg-paper/95 max-sm:px-4 max-sm:pt-3 max-sm:backdrop-blur-sm",
            "max-sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]",
            "max-sm:shadow-[0_-10px_30px_-18px_rgb(45_45_45/0.65)]",
            "max-sm:transition-transform max-sm:duration-300 max-sm:ease-out",
            "motion-reduce:transition-none",
            !barVisible && "max-sm:translate-y-full"
          )}
        >
          {product.purchaseOnly ? (
            /* One action, because there is only one thing to do with it. */
            <Button
              type="button"
              variant="pill"
              disabled={addingCart}
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                submit(false)
              }}
              className="h-14 w-full text-base font-semibold sm:h-15 sm:text-base"
            >
              {addingCart ? (
                <DotPulse label="Adding" className="min-h-[1.25em]" />
              ) : (
                "Add to Bag"
              )}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="pill"
                disabled={addingCart}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget
                  submit(true)
                }}
                className="h-14 w-full text-base font-semibold sm:h-15 sm:text-base"
              >
                {addingCart ? (
                  <DotPulse label="Reserving" className="min-h-[1.25em]" />
                ) : (
                  "Reserve These Dates"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={addingCart}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget
                  submit(false)
                }}
                className="h-14 w-full rounded-full border-ink/20 text-base font-semibold text-ink sm:h-15 sm:text-base"
              >
                Add to Bag
              </Button>
            </>
          )}
        </div>

        {/* The reassurance stays in the flow: it belongs next to the price,
            and a phone's action bar has room for the actions only. */}
        <p className="mt-2 text-center text-base text-ink-soft">
          {product.purchaseOnly
            ? "Delivered with your order — nothing to return."
            : "Rates and fitting slots are confirmed with you before payment."}
        </p>
      </div>
    </>
  )
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { data: catalog = [], isPending, isError } = useCatalogProducts()

  const product = useMemo(
    () => catalog.find((item) => slugifyProductName(item.name) === slug),
    [catalog, slug]
  )

  const range = useMemo<DateRange | undefined>(() => {
    const startDateParam =
      searchParams.get("startDate") ?? searchParams.get("date")
    const returnDateParam = searchParams.get("returnDate")

    const from = startDateParam ? new Date(startDateParam) : undefined
    const to = returnDateParam ? new Date(returnDateParam) : undefined

    if (!from && !to) return undefined
    return { from, to }
  }, [searchParams])

  const rentalDays = useMemo(() => {
    if (!range?.from || !range?.to) return 0
    return differenceInCalendarDays(range.to, range.from) + 1
  }, [range])

  const dailyRate = useMemo(() => {
    if (!product) return 0
    return product.price / Math.max(product.duration, 1)
  }, [product])

  const totalRate = useMemo(
    () => (rentalDays ? dailyRate * rentalDays : 0),
    [dailyRate, rentalDays]
  )

  const handleRangeChange = useCallback(
    (selectedRange: DateRange | undefined) => {
      if (!selectedRange?.from) {
        navigate(`/products/${slug}`, { replace: true })
        return
      }

      const params = new URLSearchParams()
      params.set("startDate", formatDateForURL(selectedRange.from))
      if (selectedRange.to) {
        params.set("returnDate", formatDateForURL(selectedRange.to))
      }

      navigate(`/products/${slug}?${params.toString()}`, { replace: true })
    },
    [navigate, slug]
  )

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return catalog.filter((item) => item.id !== product.id).slice(0, 8)
  }, [catalog, product])

  if (isPending) {
    return (
      <main className="bg-paper">
        <div className="grid lg:grid-cols-[60%_40%]">
          <div className="aspect-3/4 animate-pulse bg-pink-light lg:aspect-auto lg:min-h-160" />{" "}
          <div className="space-y-4 px-4 py-10 sm:px-8">
            <div className="h-8 w-2/3 animate-pulse rounded bg-pink-light" />{" "}
            <div className="h-4 w-1/3 animate-pulse rounded bg-pink-light" />{" "}
            <div className="h-24 w-full animate-pulse rounded bg-pink-light" />
          </div>
        </div>
      </main>
    )
  }

  if (isError || !product) {
    return (
      <main className="bg-paper">
        <Helmet>
          <title>{buildTitle("Piece not found")}</title>{" "}
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-medium text-ink">
            We could not find that piece
          </h1>
          <p className="mt-2 text-base text-ink-soft">
            It may have been renamed or is no longer available to rent.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-base font-medium text-brand underline underline-offset-4"
          >
            <ArrowLeftIcon size={16} weight="bold" />
            Back to all pieces
          </Link>
        </section>
      </main>
    )
  }

  const pageTitle = buildTitle(product.name)
  const pageDesc = product.description?.[0] ?? DEFAULT_DESCRIPTION

  return (
    <main className="bg-paper">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />{" "}
        <meta property="og:title" content={pageTitle} />{" "}
        <meta name="twitter:title" content={pageTitle} />{" "}
        <meta property="og:description" content={pageDesc} />{" "}
        <meta name="twitter:description" content={pageDesc} />
      </Helmet>

      <div className="grid lg:grid-cols-[60%_40%] lg:items-start">
        <div className="lg:sticky lg:top-16">
          <ProductImageMosaic key={product.id} product={product} />
        </div>
        <div className="px-4 py-8 sm:px-10 md:px-12 lg:px-16 lg:py-12 xl:px-24">
          <ProductHeader product={product} />

          <ProductPurchasePanel
            key={product.id}
            product={product}
            range={range}
            rentalDays={rentalDays}
            dailyRate={dailyRate}
            totalRate={totalRate}
            onRangeChange={handleRangeChange}
          />

          {/* Fittings and returns are a hire's story, not a purchase's. */}
          {product.purchaseOnly ? null : <HowRentingWorksCard />}

          {product.description.length > 0 ? (
            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="details">
                <AccordionTrigger className="py-4 text-base font-semibold text-ink hover:no-underline">
                  The details
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.description.map((item) => (
                      <li
                        key={item}
                        className="ml-4 list-disc text-base leading-relaxed text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </div>
      </div>

      {/* The shop's account of the piece, then everyone else's. */}
      <ProductDescription html={product.descriptionHtml} />

      {/* Ratings sit below the piece itself: they answer "should I trust
          this?", a question that only arises once someone is interested. */}
      <ReviewsSection
        productId={String(product.id)}
        productName={product.name}
      />

      {relatedProducts.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="border-t border-line py-12 sm:py-16"
        >
          <h2
            id="related-heading"
            className="px-4 text-center font-heading text-2xl font-medium text-ink sm:px-6 sm:text-3xl"
          >
            You may also like
          </h2>

          <ul className="mt-6 no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
            {relatedProducts.map((item) => (
              <li
                key={item.id}
                className="w-[74%] shrink-0 snap-start sm:w-[38%] lg:w-[24%] xl:w-[20%]"
              >
                <ProductCard product={item} compact />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PlanSection />
      <FaqSection />
    </main>
  )
}

/** Title block: rating, favourite toggle, name, collection and rate. */
function ProductHeader({ product }: { product: CatalogProduct }) {
  const { saved, toggle } = useFavorite(product.id)

  return (
    <header>
      <div className="flex items-start justify-end gap-4">
        <button
          type="button"
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${product.name} from favorites`
              : `Save ${product.name} to favorites`
          }
          onClick={() => void toggle()}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-ink transition hover:scale-105 active:scale-95"
        >
          <CoatHangerIcon
            size={18}
            weight={saved ? "fill" : "regular"}
            className={cn(saved && "text-brand")}
          />
        </button>
      </div>

      <h1 className="mt-3 font-heading text-4xl leading-tight font-medium text-ink sm:text-5xl">
        {product.name}
      </h1>

      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-base">
        {product.brand ? (
          <Link
            to="/shop"
            className="font-bold text-black underline-offset-4 hover:underline"
          >
            {product.brand}
          </Link>
        ) : null}
        <span className="text-ink-soft">
          {product.purchaseOnly
            ? currencyFormatter.format(product.price)
            : `From ${currencyFormatter.format(product.price)} · ${product.duration}-day rental`}
        </span>
      </p>
    </header>
  )
}
