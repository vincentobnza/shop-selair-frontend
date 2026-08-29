import { Link } from "react-router-dom"
import { AppImage } from "@/components/ui/app-image"
import { EDITORIAL_TILES } from "@/dummy/sampleData"

/**
 * Full-bleed editorial mosaic: image tiles with a white pill CTA anchored to
 * the bottom, as in the reference home page. Collapses to a single column on
 * small screens so each tile keeps a usable tap target.
 */
export function EditorialTiles() {
  return (
    <section aria-label="Shop by occasion" className="bg-paper">
      <div className="grid gap-px bg-line sm:grid-cols-3">
        {EDITORIAL_TILES.map((tile) => (
          <article key={tile.id} className="group relative bg-paper">
            <AppImage
              src={tile.image}
              alt={tile.alt}
              className="h-[24rem] w-full object-cover sm:h-[30rem]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6 text-center">
              <p className="text-base font-semibold text-white drop-shadow-sm sm:text-base">
                {tile.label}
              </p>
              <Link
                to={tile.to}
                className="inline-flex min-h-11 items-center rounded-full bg-white px-6 text-base font-semibold text-ink transition-colors group-hover:bg-brand group-hover:text-white"
              >
                {tile.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EditorialTiles
