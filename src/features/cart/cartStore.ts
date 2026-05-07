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
  /** ISO date `yyyy-MM-dd` when added from rental flow */
  rentalStart?: string
  rentalEnd?: string
}

export type RentalWindow = { start: string; end: string }

function lineMatch(a: GuestCartLine, productId: string, size: string): boolean {
  return a.productId === productId && (a.size ?? "") === size
}

function mergeGuestLines(
  lines: GuestCartLine[],
  productId: string,
  qty: number,
  size = "",
  rental?: RentalWindow,
): GuestCartLine[] {
  const next = [...lines]
  const i = next.findIndex((l) => lineMatch(l, productId, size))
  if (i >= 0) {
    next[i] = {
      ...next[i],
      quantity: next[i].quantity + qty,
      ...(rental
        ? { rentalStart: rental.start, rentalEnd: rental.end }
        : {}),
    }
  } else {
    next.push({
      productId,
      quantity: qty,
      size,
      ...(rental
        ? { rentalStart: rental.start, rentalEnd: rental.end }
        : {}),
    })
  }
  return next
}

type CartState = {
  apiCart: CartPayload | null
  guestLines: GuestCartLine[]
  /** Signed-in cart: rental dates keyed `productId::size` (ISO yyyy-MM-dd). */
  reservationByProductKey: Record<string, RentalWindow>
  loading: boolean
  load: () => Promise<void>
  addItem: (
    productId: string,
    quantity?: number,
    size?: string,
    rental?: RentalWindow,
  ) => Promise<void>
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
      reservationByProductKey: {},
      loading: false,

      resetApi: () => set({ apiCart: null, reservationByProductKey: {} }),

      load: async () => {
        const token = useAuthStore.getState().token
        if (!token) {
          set({ apiCart: null })
          return
        }
        set({ loading: true })
        try {
          const data = await cartApi.fetchCart()
          set((s) => {
            const nextRes = { ...s.reservationByProductKey }
            for (const k of Object.keys(nextRes)) {
              const inApi = data.items.some(
                (item) =>
                  `${item.product_id}::${item.size_label ?? ""}` === k,
              )
              if (!inApi) delete nextRes[k]
            }
            return { apiCart: data, reservationByProductKey: nextRes }
          })
        } finally {
          set({ loading: false })
        }
      },

      addItem: async (
        productId: string,
        quantity = 1,
        size?: string,
        rental?: RentalWindow,
      ) => {
        const token = useAuthStore.getState().token
        const qty = Math.max(1, quantity)
        const pid = productId.trim()
        if (pid === "") {
          throw new ApiError(422, {
            message: "Invalid product id.",
            errors: {
              product_id: ["Invalid product id."],
            },
          })
        }
        const sizeKey = size ?? ""

        if (token) {
          await cartApi.addCartItem(pid, qty, sizeKey || undefined)
          await get().load()
          if (rental?.start && rental?.end) {
            set((s) => ({
              reservationByProductKey: {
                ...s.reservationByProductKey,
                [`${productId}::${sizeKey}`]: {
                  start: rental.start,
                  end: rental.end,
                },
              },
            }))
          }
          return
        }

        set((s) => ({
          guestLines: mergeGuestLines(
            s.guestLines,
            productId,
            qty,
            sizeKey,
            rental,
          ),
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
      partialize: (s) => ({
        guestLines: s.guestLines,
        reservationByProductKey: s.reservationByProductKey,
      }),
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
