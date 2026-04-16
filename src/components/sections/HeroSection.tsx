import { Button } from "@/components/ui/button"

type HeroSectionProps = {
  eyebrow?: string
  title: string
  description: string
  ctaLabel: string
}

export function HeroSection({
  eyebrow = "Modern daily convenience",
  title,
  description,
  ctaLabel,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-10 -left-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-28 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-24">
        <p className="mb-5 inline-flex w-fit items-center rounded-full border border-zinc-300/70 bg-white/70 px-3 py-1 text-xs tracking-wide text-zinc-700">
          {eyebrow}
        </p>

        <h1 className="max-w-3xl font-heading text-4xl leading-tight tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
          {description}
        </p>

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
