import React from "react"
import { Link } from "react-router-dom"
import { SAMPLE_DATA } from "@/dummy/sampleData"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

export function NewArrival() {
  const items = SAMPLE_DATA.NewArrivals || []

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center font-heading text-3xl leading-tight text-zinc-900">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="group overflow-hidden">
              <Link to={`/products/${item.id}`} className="block">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {/* front image */}
                  <img
                    src={item.image?.[0]}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:opacity-0"
                  />

                  {/* back image (appears on hover) */}
                  {item.image?.[1] ? (
                    <img
                      src={item.image[1]}
                      alt={`${item.name} (back)`}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
                    />
                  ) : null}
                </div>

                <div className="mt-4">
                  <h1 className="font-heading text-sm font-medium text-zinc-900 md:text-base">
                    {item.name}
                  </h1>
                  <p className="mt-2 text-sm font-bold text-orange-900">
                    From {currencyFormatter.format(item.price)}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
