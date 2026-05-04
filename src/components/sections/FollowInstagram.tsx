import { useEffect, useRef } from "react"
import { InstagramLogoIcon } from "@phosphor-icons/react"

import { useNearViewport } from "@/hooks/useNearViewport"
import { Button } from "@/components/ui/button"
import BGVideo from "@/assets/video_bg_social.mp4"

export function FollowInstagram() {
  const { ref, near } = useNearViewport("400px")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!near || !v) return
    void v.play().catch(() => { })
  }, [near])

  return (
    <section
      ref={ref}
      id="follow-us"
      className="relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {near ? <source src={BGVideo} type="video/mp4" /> : null}
      </video>

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/20">
            <InstagramLogoIcon size={32} weight="fill" className="text-white" />
          </div>

          <h2 className="mb-4 font-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
            Follow Us on Instagram
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-sm text-white/90 sm:text-base lg:text-lg">
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
        </div>
      </div>
    </section>
  )
}
