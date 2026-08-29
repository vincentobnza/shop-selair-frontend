import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { AppImage } from "@/components/ui/app-image"
import { FooterLogin } from "@/components/FooterLogin"

type AuthSplitLayoutProps = {
  children: ReactNode
  imageSrc: string
  imageAlt?: string
}

export function AuthSplitLayout({
  children,
  imageSrc,
  imageAlt = "",
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-svh bg-white text-ink">
      <div className="mx-auto grid min-h-svh max-w-360 grid-cols-1 lg:grid-cols-2 lg:items-stretch">
        <aside className="order-1 hidden items-center justify-center px-5 pt-8 pb-5 sm:px-8 sm:pt-10 sm:pb-6 lg:order-2 lg:flex lg:px-8 lg:py-10 xl:px-12 xl:py-12">
          <div className="relative w-full max-w-md overflow-hidden rounded-[1.25rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] sm:rounded-[1.75rem] lg:max-w-[min(100%,22rem)] xl:max-w-104">
            <div className="relative min-h-[calc(100svh-20rem)]">
              <AppImage
                src={imageSrc}
                alt={imageAlt}
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </aside>
        <div className="order-2 flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:order-1 lg:px-14 lg:py-16 xl:px-20">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <Link
              to="/"
              className="font-logo text-[1.85rem] leading-none text-ink sm:text-[2rem]"
            >
              Selair
            </Link>
            {children}
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <FooterLogin />
      </div>
    </div>
  )
}
