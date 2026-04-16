import { Outlet } from "react-router-dom"

import { Navbar } from "@/components/layout/Navbar"

export function AppShell() {
  return (
    <div className="min-h-svh bg-[linear-gradient(180deg,#fffdfa_0%,#f8f6f2_58%,#f4f1eb_100%)] text-foreground">
      <Navbar />
      <Outlet />
    </div>
  )
}
