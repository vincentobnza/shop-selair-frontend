import { create } from "zustand"
import { persist } from "zustand/middleware"

import * as cartApi from "@/features/cart/api"
import type { CartPayload } from "@/features/cart/types"
import { ApiError } from "@/features/auth/errors"
import { useAuthStore } from "@/features/auth/store"

export type GuestCartLine = {
  productId: string
  quantity: number
  /** Guest cart line key; omit in persisted legacy lines (treated as ""). */
  size?: string
}

function lineMatch(a: GuestCartLine, productId: string, size: string): boolean {
  return a.productId === productId && (a.size ?? "") === size
}

function mergeGuestLines(
  lines: GuestCartLine[],
  productId: string,
  qty: number,
  size = "",
): GuestCartLine[] {
  const next = [...lines]
  const i = next.findIndex((l) => lineMatch(l, productId, size))
  if (i >= 0) {
    next[i] = { ...next[i], quantity: next[i].quantity + qty }
  } else {
    next.push({ productId, quantity: qty, size })
  }
  return next
}

type CartState = {
  apiCart: CartPayload | null
  guestLines: GuestCartLine[]
  loading: boolean
  load: () => Promise<void>
  addItem: (productId: string, quantity?: number, size?: string) => Promise<void>
  updateApiLine: (cartItemId: number, quantity: number) => Promise<void>
  removeApiLine: (cartItemId: number) => Promise<void>
  updateGuestLine: (productId: string, quantity: number, size?: string) => void
  removeGuestLine: (productId: string, size?: string) => void
  clearGuest: () => void
  clearApi: () => Promise<void>
  resetApi: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      apiCart: null,
      guestLines: [],
      loading: false,

      resetApi: () => set({ apiCart: null }),

      load: async () => {
        const token = useAuthStore.getState().token
        if (!token) {
          set({ apiCart: null })
          return
        }
        set({ loading: true })
        try {
          const data = await cartApi.fetchCart()
          set({ apiCart: data })
        } finally {
          set({ loading: false })
        }
      },

      addItem: async (productId: string, quantity = 1, size?: string) => {
        const token = useAuthStore.getState().token
        const qty = Math.max(1, quantity)
        const pid = Number(productId)
        const sizeKey = size ?? ""

        if (token) {
          try {
            await cartApi.addCartItem(pid, qty, sizeKey || undefined)
            await get().load()
          } catch (e) {
            if (e instanceof ApiError && e.status === 422) {
              set((s) => ({
                guestLines: mergeGuestLines(s.guestLines, productId, qty, sizeKey),
              }))
              return
            }
            throw e
          }
          return
        }

        set((s) => ({
          guestLines: mergeGuestLines(s.guestLines, productId, qty, sizeKey),
        }))
      },

      updateApiLine: async (cartItemId: number, quantity: number) => {
        await cartApi.updateCartItem(cartItemId, quantity)
        await get().load()
      },

      removeApiLine: async (cartItemId: number) => {
        await cartApi.removeCartItem(cartItemId)
        await get().load()
      },

      updateGuestLine: (productId: string, quantity: number, size = "") => {
        if (quantity < 1) {
          get().removeGuestLine(productId, size)
          return
        }
        set((s) => ({
          guestLines: s.guestLines.map((l) =>
            lineMatch(l, productId, size) ? { ...l, quantity } : l,
          ),
        }))
      },

      removeGuestLine: (productId: string, size = "") => {
        set((s) => ({
          guestLines: s.guestLines.filter((l) => !lineMatch(l, productId, size)),
        }))
      },

      clearGuest: () => set({ guestLines: [] }),

      clearApi: async () => {
        await cartApi.clearCart()
        await get().load()
      },
    }),
    {
      name: "selair-guest-cart",
      partialize: (s) => ({ guestLines: s.guestLines }),
    },
  ),
)

export function useCartItemCount(): number {
  const token = useAuthStore((s) => s.token)
  const apiCart = useCartStore((s) => s.apiCart)
  const guestLines = useCartStore((s) => s.guestLines)
  const guestCount = guestLines.reduce((n, l) => n + l.quantity, 0)
  if (token) {
    return (apiCart?.item_count ?? 0) + guestCount
  }
  return guestCount
}
