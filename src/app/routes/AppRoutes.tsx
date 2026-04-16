import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { EssentialsPage } from "@/pages/EssentialsPage"
import { HomePage } from "@/pages/HomePage"
import { RentPage } from "@/pages/RentPage"
import { ShopPage } from "@/pages/ShopPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="rent" element={<RentPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="essentials" element={<EssentialsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
