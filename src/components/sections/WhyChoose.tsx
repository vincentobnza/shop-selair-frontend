import {
  CheckCircleIcon,
  SparkleIcon,
  WalletIcon,
  LeafIcon,
  PackageIcon,
  PaletteIcon,
} from "@phosphor-icons/react"

const features = [
  {
    title: "Curated Selection",
    description:
      "Hand-picked designer pieces and essentials for every occasion and lifestyle.",
    icon: SparkleIcon,
  },
  {
    title: "Affordable Access",
    description:
      "Enjoy premium fashion at a fraction of the retail price through our rental model.",
    icon: WalletIcon,
  },
  {
    title: "Sustainable Fashion",
    description:
      "Make conscious choices by reducing fashion waste and extending garment lifecycles.",
    icon: LeafIcon,
  },
  {
    title: "Convenient Delivery",
    description:
      "Fast, reliable shipping with seamless returns directly to your doorstep.",
    icon: PackageIcon,
  },
  {
    title: "Expert Styling",
    description:
      "Get personalized recommendations from our team of fashion enthusiasts.",
    icon: PaletteIcon,
  },
  {
    title: "Quality Guarantee",
    description:
      "Every piece is professionally maintained and inspected for your peace of mind.",
    icon: CheckCircleIcon,
  },
]

export function WhyChoose() {
  return (
    <section id="why-selair" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-4 font-heading text-2xl leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
            Why Choose Selair?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-zinc-600 sm:text-base">
            Discover what makes Selair the preferred choice for modern fashion
            enthusiasts across the Philippines.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center px-4 py-1"
              >
                <div className="mb-5 flex">
                  <IconComponent size={32} className="text-[#2c2824]" />
                </div>
                <h3 className="mb-2 font-heading text-base text-zinc-900 md:text-lg lg:text-xl">
                  {feature.title}
                </h3>
                <p className="text-center text-sm text-zinc-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
