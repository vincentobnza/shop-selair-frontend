import { Outlet } from "react-router-dom"
import { PromoBanner } from "@/components/PromoBanner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { TooltipProvider } from "../ui/tooltip"
export function AppShell() {
  return (
    <>
      <TooltipProvider>
        <div className="min-h-svh overflow-x-clip bg-background text-foreground">
          <PromoBanner />
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </>
  )
}
