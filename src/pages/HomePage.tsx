import { Suspense, lazy } from "react"

import SuspenseLoading from "@/components/SuspenseLoading"

const HomePageBody = lazy(() => import("./HomePageBody"))

export function HomePage() {
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <HomePageBody />
    </Suspense>
  )
}
