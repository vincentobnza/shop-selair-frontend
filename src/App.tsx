import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { AppRoutes } from "@/app/routes/AppRoutes"

export function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
