import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"

import { buildTitle, DEFAULT_DESCRIPTION } from "@/config/site"
import { ReservationCalendar } from "@/components/ReservationCalendar"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { differenceInCalendarDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { BagIcon } from "@phosphor-icons/react"

import { ProductCard } from "@/components/ProductCard"
import { ProductSizePicker } from "@/components/ProductSizePicker"
import { useCartStore } from "@/features/cart/cartStore"
import { useCatalogProduct, useCatalogProducts } from "@/features/products/queries"
import type { CatalogProduct } from "@/features/products/types"
import { toast } from "sonner"
import { FaqSection } from "@/components/sections/FaqSection"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

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
  const [addingCart, setAddingCart] = useState(false)
  const [size, setSize] = useState<string | null>(null)

  const needsSize = product.sizes.length > 0

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
        <span className="font-heading text-2xl font-bold text-zinc-900 sm:text-3xl">
          {currencyFormatter.format(product.price)}
        </span>
        <span className="px-2 py-1 text-xs  text-zinc-600 sm:px-3 sm:text-sm">
          {product.duration} day rental
        </span>
      </div>

      <ProductSizePicker
        sizes={product.sizes}
        value={size}
        onChange={setSize}
        hint={needsSize && !size}
      />

      <div className="mt-6 flex flex-col gap-2 sm:mt-8">
        <ReservationCalendar range={range} setRange={onRangeChange} />

        <div className="border border-black bg-zinc-50/70">
          <div className="grid gap-3 text-sm text-zinc-700 sm:grid-cols-2 p-4">
            <div>
              <p className="text-[10px] text-black font-semibold uppercase">
                Start date
              </p>
              <p className="font-medium text-sm md:text-base text-zinc-900">
                {range?.from ? format(range.from, "PPP") : "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-black font-semibold uppercase">
                Return date
              </p>
              <p className="font-medium text-sm md:text text-zinc-900">
                {range?.to ? format(range.to, "PPP") : "-"}
              </p>
            </div>
          </div>

          <div className="border-t border-black py-2 px-4 bg-white">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Rate
              </p>
              <p className="font-heading text-xl font-semibold text-zinc-900">
                {currencyFormatter.format(totalRate)}
              </p>
            </div>
            <p className="text-sm md:text-base  font-semibold text-black">
              {currencyFormatter.format(Math.round(dailyRate))} / day
              {rentalDays
                ? ` x ${rentalDays} day${rentalDays > 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            type="button"
            disabled={addingCart}
            className="h-auto rounded-none px-6 py-4 text-sm sm:text-base"
            onClick={() => {
              if (needsSize && !size) {
                toast.error(
                  "Please choose a size before reserving or adding to cart.",
                )
                return
              }
              if (!range?.from) {
                toast.error(
                  "Please select a start date to proceed with reservation.",
                )
                return
              }
              if (!range?.to) {
                toast.error(
                  "Please select a return date to complete your rental period.",
                )
                return
              }
              setAddingCart(true)
              const rental = {
                start: format(range.from, "yyyy-MM-dd"),
                end: format(range.to, "yyyy-MM-dd"),
              }
              void addToCart(String(product.id), 1, size ?? undefined, rental)
                .then(() => {
                  toast.success("Added to cart", {
                    description: "Item added to cart successfully",
                  })
                })
                .catch(() => {
                  toast.error("Could not add to cart")
                })
                .finally(() => setAddingCart(false))
            }}
          >
            Reserve now
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={addingCart}
            className="h-auto rounded-none border-black bg-transparent px-6 py-4 text-sm text-black sm:text-base"
            onClick={() => {
              if (needsSize && !size) {
                toast.error(
                  "Please choose a size before reserving or adding to cart.",
                )
                return
              }
              setAddingCart(true)
              const rental =
                range?.from && range?.to
                  ? {
                    start: format(range.from, "yyyy-MM-dd"),
                    end: format(range.to, "yyyy-MM-dd"),
                  }
                  : undefined
              void addToCart(String(product.id), 1, size ?? undefined, rental)
                .then(() => {
                  toast.success("Added to cart", {
                    description: "Item added to cart successfully",
                  })
                })
                .catch(() => {
                  toast.error("Could not add to cart")
                })
                .finally(() => setAddingCart(false))
            }}
          >
            {addingCart ? (
              <DotPulse label="Adding to cart" className="min-h-[1.25em]" />
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>

      </div>

    </>
  )
}

function ProductImageGallery({ product }: { product: CatalogProduct }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mainSrc =
    product.image[
    Math.min(activeIndex, Math.max(0, product.image.length - 1))
    ] ?? ""

  return (
    <div
      className={cn(
        "flex flex-row items-start gap-3",
        product.image.length <= 1 && "flex-col",
      )}
    >
      {product.image.length > 1 ? (
        <div
          className="flex max-h-[min(70vh,32rem)] w-16 shrink-0 flex-col gap-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:w-18 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Product views"
        >
          {product.image.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "mt-0.3 touch-manipulation w-full shrink-0 overflow-hidden border-2 bg-zinc-50 transition-colors cursor-pointer",
                index === activeIndex
                  ? "border-zinc-200"
                  : "border-transparent opacity-80 hover:opacity-100 grayscale",
              )}
            >
              <img
                src={image}
                alt=""
                className="block aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="min-w-0 flex-1 overflow-hidden bg-zinc-50">
        {mainSrc ? (
          <img
            src={mainSrc}
            alt={product.name}
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="aspect-3/4 bg-zinc-100" />
        )}
      </div>
    </div>
  )
}

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    data: product,
    isPending,
    isError,
  } = useCatalogProduct(productId)
  const { data: catalog = [] } = useCatalogProducts()

  const range = useMemo<DateRange | undefined>(() => {
    const startDateParam = searchParams.get("startDate") ?? searchParams.get("date")
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

  const totalRate = useMemo(() => {
    if (!rentalDays) return 0
    return dailyRate * rentalDays
  }, [dailyRate, rentalDays])

  const handleRangeChange = (selectedRange: DateRange | undefined) => {
    if (!selectedRange?.from) {
      navigate(`/products/${productId}`, { replace: true })
      return
    }

    const params = new URLSearchParams()
    params.set("startDate", formatDateForURL(selectedRange.from))

    if (selectedRange.to) {
      params.set("returnDate", formatDateForURL(selectedRange.to))
    }

    navigate(`/products/${productId}?${params.toString()}`, {
      replace: true,
    })
  }

  const formatDateForURL = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return catalog.filter((item) => item.id !== product.id).slice(0, 3)
  }, [catalog, product])

  if (isPending) {
    return (
      <main className="bg-white">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="aspect-3/4 animate-pulse bg-zinc-100" />
            <div className="space-y-4 pt-6">
              <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (isError || !product) {
    return (
      <main className="bg-white">
        <Helmet>
          <title>{buildTitle("Product not found")}</title>
        </Helmet>
        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="font-heading text-lg text-zinc-900">Product not found</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 underline underline-offset-4"
          >
            <BagIcon size={16} weight="bold" />
            Back to shop
          </Link>
        </section>
      </main>
    )
  }

  const pageTitle = buildTitle(product.name)
  const pageDesc = product.description?.[0] ?? DEFAULT_DESCRIPTION

  return (
    <main className="bg-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta name="twitter:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta name="twitter:description" content={pageDesc} />
      </Helmet>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <Link
            to="/shop"
            className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-900 flex items-center gap-2 border-b border-zinc-800 pb-0.5"

          >
            <BagIcon size={16} weight="bold" />
            Back to shop
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <ProductImageGallery key={product.id} product={product} />
          </div>

          <div className="lg:pt-6">
            <p className="font-heading text-sm font-medium text-zinc-700 uppercase">
              Selair Collection
            </p>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-medium  text-zinc-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              A refined rental piece selected for modern occasions, designed to
              feel polished, effortless, and elegant.
            </p>

            <ProductPurchasePanel
              key={product.id}
              product={product}
              range={range}
              rentalDays={rentalDays}
              dailyRate={dailyRate}
              totalRate={totalRate}
              onRangeChange={handleRangeChange}
            />
          </div>
        </div>

      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-5 font-heading font-medium text-2xl text-zinc-900">Product Description</h1>
        <ul className="mt-2">
          {product.description.map((item) => (
            <li key={item} className="mt-2 ml-4 list-disc text-sm sm:text-base text-zinc-600">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <FaqSection />
      {relatedProducts.length > 0 ? (
        <section className="px-4 py-10 sm:px-6 lg:px-8 mt-16 border-t border-zinc-200 pt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-heading text-2xl text-zinc-900">
                More to explore
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Similar pieces selected from the collection.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}



      {/* FAQ's */}

    </main>
  )
}
