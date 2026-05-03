import { Link } from "react-router-dom"
import { SAMPLE_DATA } from "@/dummy/sampleData"
import useEmblaCarousel from "embla-carousel-react"

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

export function NewArrival() {
  const items = SAMPLE_DATA.NewArrivals || []
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" })






  return (
    <section id="new-arrivals" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center font-heading text-xl sm:text-3xl leading-tight text-zinc-900 ">
          New Arrivals
        </h2>

        <div className="sm:hidden">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="-ml-3 flex touch-pan-y">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 shrink-0 basis-[78%] pl-3"
                >
                  <Link to={`/products/${item.id}`} className="group block">
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: "3 / 4" }}
                    >
                      <img
                        src={item.image?.[0]}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>

                    <div className="mt-4">
                      <h1 className="font-heading text-sm font-medium text-zinc-900 line-clamp-1">
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


        </div>

        <div className="hidden grid-cols-1 gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="group overflow-hidden">
              <Link to={`/products/${item.id}`} className="block">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "3 / 4" }}
                >
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
                  <h1 className="font-heading text-sm font-medium text-zinc-900 md:text-base line-clamp-1">
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

        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-block font-heading text-sm font-medium  text-zinc-900 underline underline-offset-4 transition-colors hover:bg-zinc-100"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}
