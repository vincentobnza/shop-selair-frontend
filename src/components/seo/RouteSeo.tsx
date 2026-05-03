import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"

import { getSeoForPath } from "@/components/seo/page-seo"
import { absolutePath, getSiteOrigin, SITE_NAME } from "@/config/site"

const OG_IMAGE =
  typeof import.meta.env.VITE_OG_IMAGE === "string"
    ? import.meta.env.VITE_OG_IMAGE.trim()
    : ""

export function RouteSeo() {
  const { pathname } = useLocation()
  const seo = getSeoForPath(pathname)
  const canonical = absolutePath(pathname)
  const origin = getSiteOrigin()
  const showOrgJsonLd = pathname.replace(/\/$/, "") === "/" && origin !== ""

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={seo.robots} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />

      {OG_IMAGE ? (
        <>
          <meta property="og:image" content={OG_IMAGE} />
          <meta name="twitter:image" content={OG_IMAGE} />
        </>
      ) : null}

      <meta name="theme-color" content="#ffffff" />

      {showOrgJsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: origin,
            description: seo.description,
          })}
        </script>
      ) : null}
    </Helmet>
  )
}
