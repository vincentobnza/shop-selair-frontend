import { Outlet } from "react-router-dom"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
