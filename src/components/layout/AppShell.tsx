import { Outlet } from "react-router-dom"

import { PromoBanner } from "@/components/PromoBanner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export function AppShell() {
  return (
    <div className="min-h-svh overflow-x-clip bg-background text-foreground">
      <PromoBanner />
      <Navbar />
      <main className="pt-[calc(2.5rem+3.75rem)] sm:pt-[calc(2.5rem+7rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
