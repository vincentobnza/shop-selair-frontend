import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"

import { SAMPLE_DATA } from "@/dummy/sampleData"
import { ReservationCalendar } from "@/components/ReservationCalendar"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const date = useMemo(() => {
    const dateParam = searchParams.get("date")
    return dateParam ? new Date(dateParam) : null
  }, [searchParams])

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      navigate(
        `/products/${productId}?date=${formatDateForURL(selectedDate)}`,
        {
          replace: true,
        }
      )
    } else {
      navigate(`/products/${productId}`, { replace: true })
    }
  }

  const formatDateForURL = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const product =
    SAMPLE_DATA.NewArrivals.find((item) => item.id === productId) ??
    SAMPLE_DATA.NewArrivals[0]

  const relatedProducts = SAMPLE_DATA.NewArrivals.filter(
    (item) => item.id !== product.id
  ).slice(0, 3)

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <Link
            to="/shop"
            className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-900"
          >
            Back to shop
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <div className="overflow-hidden bg-zinc-50">
              <img
                src={product.image[0]}
                alt={product.name}
                className="block h-full w-full object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.image.slice(1).map((image, index) => (
                <div key={image} className="overflow-hidden bg-zinc-50">
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 2}`}
                    className="block aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pt-6">
            <p className="font-heading text-sm font-medium text-zinc-700 uppercase">
              Selair Collection
            </p>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-medium tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              A refined rental piece selected for modern occasions, designed to
              feel polished, effortless, and elegant.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <span className="font-heading text-2xl font-bold text-zinc-900 sm:text-3xl">
                {currencyFormatter.format(product.price)}
              </span>
              <span className="px-2 py-1 text-xs tracking-tight text-zinc-600 sm:px-3 sm:text-sm">
                {product.duration} day rental
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:mt-8">
              <ReservationCalendar
                date={date ?? undefined}
                setDate={handleDateChange}
              />

              {!date && (
                <span className="font-heading text-sm font-semibold tracking-tight text-orange-900">
                  - Please select a date to proceed with reservation.
                </span>
              )}
              <button
                className={cn(
                  "bg-zinc-900 px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:text-base",
                  !date && "cursor-not-allowed opacity-20"
                )}
                disabled={!date}
              >
                Reserve now
              </button>

              {/* DESCRIPTION */}
              <div className="pt-2">
                <h1 className="mb-5 font-heading font-medium">Description</h1>
                <ul className="mt-2">
                  {product.description.map((item) => (
                    <li key={item} className="mt-2 ml-4 list-disc text-sm text-zinc-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-16 border-t border-zinc-200 pt-12">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  className="group overflow-hidden bg-white"
                >
                  <div
                    className="overflow-hidden bg-zinc-50"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="py-5">
                    <h3 className="font-heading text-sm font-semibold text-zinc-900 md:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold tracking-tight text-orange-900 md:text-base">
                      {currencyFormatter.format(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}
