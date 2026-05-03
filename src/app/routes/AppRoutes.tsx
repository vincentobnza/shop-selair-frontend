import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { EssentialsPage } from "@/pages/EssentialsPage"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { ProductPage } from "@/pages/ProductPage"
import { RentPage } from "@/pages/RentPage"
import { ShopPage } from "@/pages/ShopPage"
import { SignupPage } from "@/pages/SignupPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="products/:productId" element={<ProductPage />} />
        <Route path="rent" element={<RentPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="essentials" element={<EssentialsPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
