import { Button } from "@/components/ui/button"

type HeroSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  ctaLabel: string
  backgroundImage?: string
  buttonVariant?: "dark" | "light"
}

export function HeroSection({
  eyebrow = "Modern daily convenience",
  title,
  description,
  ctaLabel,
  backgroundImage,
}: HeroSectionProps) {
  // If background image is provided, render with overlay design
  if (backgroundImage) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-4 text-sm font-medium tracking-wide text-white opacity-90">
                {eyebrow}
              </p>
            )}

            <h1 className="leading-tighter font-heading text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            {description && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                {description}
              </p>
            )}

            <div className="mt-10">
              <button className="inline-flex items-center justify-center bg-white px-8 py-3 text-sm font-medium hover:text-zinc-900">
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default minimal design (fallback)
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-24">
        <p className="mb-5 inline-flex w-fit items-center rounded-full border border-zinc-300/70 bg-white/70 px-3 py-1 text-xs tracking-wide text-zinc-700">
          {eyebrow}
        </p>

        <h1 className="max-w-3xl font-heading text-4xl leading-tight tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button className="h-11 rounded bg-zinc-900 px-7 text-sm text-white hover:bg-zinc-800">
            {ctaLabel}
          </Button>
          <a
            href="#"
            className="text-sm font-medium text-zinc-700 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  )
}
