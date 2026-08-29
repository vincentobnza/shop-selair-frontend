import { Link } from "react-router-dom"

const footerLinks = [
  { to: "/terms", label: "Terms of Service" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/accessibility", label: "Accessibility Statement" },
  { to: "/privacy-choices", label: "Your Privacy Choices" },
] as const

export function FooterLogin() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-[#F9F9F9]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
          <p className="text-base text-ink-soft sm:text-base">
            ©{year} Selair. All Rights Reserved.
          </p>
          <nav
            aria-label="Legal and privacy"
            className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-6"
          >
            {footerLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-base text-muted-foreground underline-offset-4 hover:underline sm:text-base"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
