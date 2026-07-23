import { Navigate, Route, Routes } from "react-router-dom"

import { AccountLayout } from "@/components/layout/AccountLayout"
import { AppShell } from "@/components/layout/AppShell"
import { AccountSectionPage } from "@/pages/AccountSectionPage"
import { AddressesPage } from "@/pages/account/AddressesPage"
import { MyReviewsPage } from "@/pages/account/MyReviewsPage"
import { NotificationsPage } from "@/pages/account/NotificationsPage"
import { OrderDetailPage } from "@/pages/account/OrderDetailPage"
import { OrdersPage } from "@/pages/account/OrdersPage"
import { ProfilePage } from "@/pages/account/ProfilePage"
import { SettingsPage } from "@/pages/account/SettingsPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { EssentialsPage } from "@/pages/EssentialsPage"
import { FavoritesPage } from "@/pages/FavoritesPage"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { ProductPage } from "@/pages/ProductPage"
import { RentPage } from "@/pages/RentPage"
import { SearchPage } from "@/pages/SearchPage"
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
        <Route path="search" element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="essentials" element={<EssentialsPage />} />
        <Route path="account" element={<AccountLayout />}>
          <Route index element={<Navigate to="/account/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="reviews" element={<MyReviewsPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Fallback for not-yet-built sections (referral, credits, pickup…). */}
          <Route path=":slug" element={<AccountSectionPage />} />
        </Route>
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
