import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { AccountSectionPage } from "@/pages/AccountSectionPage"
import { EssentialsPage } from "@/pages/EssentialsPage"
import { FavoritesPage } from "@/pages/FavoritesPage"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { ProductPage } from "@/pages/ProductPage"
import { RentPage } from "@/pages/RentPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { ShopPage } from "@/pages/ShopPage"
import { SignupPage } from "@/pages/SignupPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="products/:slug" element={<ProductPage />} />
        <Route path="rent" element={<RentPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="essentials" element={<EssentialsPage />} />
        <Route
          path="account"
          element={<Navigate to="/account/profile" replace />}
        />
        <Route path="account/:slug" element={<AccountSectionPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
