import { ACCOUNT_SECTION_TITLES } from "@/config/account-routes"
import {
  buildTitle,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
} from "@/config/site"

export type PageSeo = {
  title: string
  description: string
  robots: "index,follow" | "noindex,nofollow"
}

const homeDescription =
  "Rent formalwear, browse new arrivals, and shop essentials. Selair brings curated style and flexible options for weddings, work, travel, and every day."

function pageSeo(pageLabel: string, description: string): PageSeo {
  return {
    title: buildTitle(pageLabel),
    description,
    robots: "index,follow",
  }
}

/** Title, description, and robots hint for the current URL (used by `<RouteSeo />`). */
export function getSeoForPath(pathname: string): PageSeo {
  const path = pathname.replace(/\/$/, "") || "/"

  if (path === "/") {
    return pageSeo("Curated fashion & rentals", homeDescription)
  }

  const staticMap: Record<string, { label: string; description: string }> = {
    "/shop": {
      label: "Shop essentials",
      description:
        "Browse practical essentials for school, home, and everyday life with straightforward checkout.",
    },
    "/rent": {
      label: "Rent formalwear",
      description:
        "Reserve polished dresses and formal looks for graduations, weddings, and special occasions.",
    },
    "/essentials": {
      label: "Everyday essentials",
      description:
        "Practical picks for daily routines—comfortable, versatile pieces you’ll reach for again and again.",
    },
    "/favorites": {
      label: "Saved items",
      description:
        "Pieces you have saved—quick links back to each listing with pricing and photos.",
    },
  }

  const section = staticMap[path]
  if (section) {
    return pageSeo(section.label, section.description)
  }

  if (path.startsWith("/products/")) {
    return pageSeo(
      "Product details",
      "View photos, pricing, rental dates, and description for this Selair listing.",
    )
  }

  if (path.startsWith("/account/")) {
    const slug = path.slice("/account/".length)
    const segment = ACCOUNT_SECTION_TITLES[slug] ?? "Account"
    return pageSeo(
      segment,
      `Manage ${segment.toLowerCase()} and preferences in your Selair account.`,
    )
  }

  if (path === "/login") {
    return {
      title: buildTitle("Sign in"),
      description:
        "Sign in to Selair to manage rentals, orders, saved items, and account settings.",
      robots: "noindex,nofollow",
    }
  }

  if (path === "/signup") {
    return {
      title: buildTitle("Create account"),
      description:
        "Create your Selair account to book rentals, track orders, and save your favorite pieces.",
      robots: "noindex,nofollow",
    }
  }

  if (path === "/checkout") {
    return {
      title: buildTitle("Checkout"),
      description:
        "Review your bag, enter delivery details, and complete your Selair order.",
      robots: "noindex,nofollow",
    }
  }

  return {
    title: buildTitle(SITE_NAME),
    description: DEFAULT_DESCRIPTION,
    robots: "index,follow",
  }
}
