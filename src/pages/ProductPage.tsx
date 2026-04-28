import { Link, useParams } from "react-router-dom"

import { SAMPLE_DATA } from "@/dummy/sampleData"
import { ReservationCalendar } from "@/components/ReservationCalendary"
import { useState } from "react"
import { cn } from "@/lib/utils"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

export function ProductPage() {
  const { productId } = useParams()
  const [date, setDate] = useState<Date>()

  const product =
    SAMPLE_DATA.NewArrivals.find((item) => item.id === productId) ??
    SAMPLE_DATA.NewArrivals[0]

  const relatedProducts = SAMPLE_DATA.NewArrivals.filter(
    (item) => item.id !== product.id
  ).slice(0, 3)

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/shop"
            className="text-sm font-medium text-zinc-900 underline transition-colors hover:text-zinc-900"
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
            <h1 className="mt-3 font-heading text-4xl leading-tight font-medium tracking-tight text-zinc-900 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              A refined rental piece selected for modern occasions, designed to
              feel polished, effortless, and elegant.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="font-heading text-3xl font-bold text-zinc-900">
                {currencyFormatter.format(product.price)}
              </span>
              <span className="px-3 py-1 text-sm tracking-tighter text-zinc-600">
                {product.duration} day rental
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <ReservationCalendar date={date} setDate={setDate} />

              {!date && (
                <span className="font-heading text-sm font-semibold tracking-tight text-orange-900">
                  - Please select a date to proceed with booking.
                </span>
              )}
              <button
                className={cn(
                  "bg-zinc-900 px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:text-base",
                  !date && "cursor-not-allowed opacity-20"
                )}
                disabled={!date}
              >
                Book now
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-16 border-t border-zinc-200 pt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
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
