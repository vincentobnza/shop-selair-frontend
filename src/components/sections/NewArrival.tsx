import { Link } from "react-router-dom"
import useEmblaCarousel from "embla-carousel-react"

import { ProductCard } from "@/components/ProductCard"
import { SAMPLE_DATA } from "@/dummy/sampleData"

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
                <div
                  key={item.id}
                  className="min-w-0 shrink-0 basis-[78%] pl-3"
                >
                  <ProductCard product={item} compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
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
