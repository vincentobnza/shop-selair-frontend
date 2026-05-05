import { Link } from "react-router-dom"
import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  TwitterLogoIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-block font-heading text-2xl text-zinc-900"
            >
              Selair
            </Link>
            <p className="mt-4 text-sm text-zinc-600">
              Curated fashion and essentials for everyday life. Thoughtfully
              sourced, responsibly delivered.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                aria-label="Instagram"
                href="#"
                className="text-zinc-600 hover:text-zinc-900"
              >
                <InstagramLogoIcon size={20} />
              </a>
              <a
                aria-label="Facebook"
                href="#"
                className="text-zinc-600 hover:text-zinc-900"
              >
                <FacebookLogoIcon size={20} />
              </a>
              <a
                aria-label="Twitter"
                href="#"
                className="text-zinc-600 hover:text-zinc-900"
              >
                <TwitterLogoIcon size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div>
              <h4 className="mb-4 text-sm font-medium text-zinc-800">Shop</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link to="/shop" className="hover:text-zinc-900">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/rent" className="hover:text-zinc-900">
                    Rent
                  </Link>
                </li>
                <li>
                  <Link to="/essentials" className="hover:text-zinc-900">
                    Essentials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-zinc-800">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link to="/about" className="hover:text-zinc-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-zinc-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-zinc-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-zinc-800">
                Stay in touch
              </h4>
              <form
                className="flex min-w-80 flex-col gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 h-10! focus:ring-2 focus:ring-zinc-200 sm:rounded-r-none"
                  />
                  <Button
                    type="submit"
                    className="rounded-md px-4 py-2 text-sm sm:rounded-l-none sm:rounded-r-md h-10.5!"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  No spam — unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-100 pt-6 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Selair. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
