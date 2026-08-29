import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AppRoutes } from "@/app/routes/AppRoutes"
import { ShoppingSync } from "@/components/ShoppingSync"
import { RouteSeo } from "@/components/seo/RouteSeo"
import { Toaster } from "@/components/ui/sonner"
export function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <ShoppingSync />
      <RouteSeo />
      <AppRoutes />
      <Toaster position="bottom-center" />
    </>
  )
}

export default App
