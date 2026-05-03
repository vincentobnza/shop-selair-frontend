import { Outlet } from "react-router-dom"

import { PromoBanner } from "@/components/PromoBanner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export function AppShell() {
  return (
    <div className="min-h-svh overflow-x-clip bg-background text-foreground">
      <PromoBanner />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
