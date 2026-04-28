import { InstagramLogo } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import BGVideo from "@/assets/video_bg_social.mp4"

export function FollowInstagram() {
  return (
    <section
      id="follow-us"
      className="relative overflow-hidden bg-black py-20 sm:py-28 lg:py-32"
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={BGVideo} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/20">
            <InstagramLogo size={32} weight="fill" className="text-white" />
          </div>

          <h2 className="mb-4 font-heading text-4xl leading-tight text-white sm:text-5xl">
            Follow Us on Instagram
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-base text-white/90 sm:text-lg">
            Stay updated with our latest collections, styling tips, and
            exclusive content. Join our community of fashion enthusiasts.
          </p>

          <a
            href="https://instagram.com/shop.selair"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-12 rounded bg-white px-8 text-base font-medium text-black hover:bg-white/90">
              @shop.selair
            </Button>
          </a>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square overflow-hidden rounded-lg bg-zinc-800"
              >
                <div className="h-full w-full bg-linear-to-br from-zinc-700 to-zinc-900" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
