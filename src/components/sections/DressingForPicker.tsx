import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

type Occasion = {
  key: string
  label: string
  href: string
  Icon: () => ReactNode
}

function IconWeddings() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden>
      <path
        d="M22 48c-2-8 2-18 10-22M42 48c2-8-2-18-10-22"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path
        d="M18 28c4-6 10-8 14-8s10 2 14 8M28 20l4-8 4 8M36 20l4-8 4 8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <circle cx="22" cy="30" fill="none" r="5" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="42" cy="30" fill="none" r="5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M22 35v8M42 35v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
    </svg>
  )
}

function IconVacation() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden>
      <path
        d="M18 26h28v22a4 4 0 01-4 4H22a4 4 0 01-4-4V26z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path
        d="M26 26V18a6 6 0 0112 0v8M22 34h20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path
        d="M24 42l4 4 8-10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  )
}

function IconWork() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden>
      <path
        d="M14 28h36v18a3 3 0 01-3 3H17a3 3 0 01-3-3V28z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path
        d="M22 28V22a10 10 0 0120 0v6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path d="M18 38h28" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
    </svg>
  )
}

function IconParties() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden>
      <circle cx="32" cy="34" fill="none" r="14" stroke="currentColor" strokeWidth="1.35" />
      <path d="M22 28l4 2M38 22l3 4M42 38l-4 2M26 42l-2-4" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M46 14l2 4M50 12l-2 4M48 18v4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path
        d="M14 18l2 3M16 14l2 3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function IconEveryday() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden>
      <path
        d="M18 20h28v36H18z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path d="M32 20v36M18 28h28" fill="none" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M24 34c2-4 6-6 8-6s6 2 8 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path d="M26 40h12M26 44h8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  )
}

const occasions: Occasion[] = [
  { key: "weddings", label: "Weddings", href: "/shop?occasion=weddings", Icon: IconWeddings },
  { key: "vacation", label: "Vacation", href: "/shop?occasion=vacation", Icon: IconVacation },
  { key: "work", label: "Work", href: "/shop?occasion=work", Icon: IconWork },
  { key: "parties", label: "Parties", href: "/shop?occasion=parties", Icon: IconParties },
  { key: "everyday", label: "Everyday", href: "/shop?occasion=everyday", Icon: IconEveryday },
]

type DressingForPickerProps = {
  ctaLabel?: string
}

export function DressingForPicker({ ctaLabel = "Browse All Styles" }: DressingForPickerProps) {
  return (
    <div className="mt-12 border-t border-neutral-100 pt-12 sm:mt-16 sm:pt-16">
      <h2 className="mb-12 text-center font-heading text-xl sm:text-3xl leading-tight text-zinc-900 tracking-tight">
        I&apos;m getting dressed for
      </h2>

      <ul className="mt-8 flex flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10 md:gap-x-12">
        {occasions.map(({ key, label, href, Icon }) => (
          <li key={key}>
            <Link
              to={href}
              className="group flex w-18 flex-col items-center gap-3 text-center sm:w-22"
            >
              <span className="flex text-neutral-800 transition-transform group-hover:scale-[1.03]">
                <Icon />
              </span>
              <span className="text-xs sm:text-sm font-medium text-neutral-800 uppercase">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center sm:mt-12">
        <Button variant="pill" asChild className="h-auto px-8 py-3 text-sm font-medium">
          <Link to="/shop">{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  )
}
