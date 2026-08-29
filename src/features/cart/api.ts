import type { ApiCartLine, CartPayload } from "@/features/cart/types"
import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

type CartJson = { data: CartPayload }

export async function fetchCart(): Promise<CartPayload> {
  const res = await api.get<CartJson>(apiPath("cart"))
  return res.data.data
}

export async function addCartItem(
  productId: number | string,
  quantity = 1,
  size?: string
): Promise<ApiCartLine> {
  const body: Record<string, number | string> = {
    product_id: productId,
    quantity,
  }
  if (size !== undefined && size !== "") {
    body.size = size
  }
  const res = await api.post<{ data: ApiCartLine }>(apiPath("cart/items"), body)
  return res.data.data
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number
): Promise<ApiCartLine> {
  const res = await api.patch<{ data: ApiCartLine }>(
    apiPath(`cart/items/${cartItemId}`),
    { quantity }
  )
  return res.data.data
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  await api.delete(apiPath(`cart/items/${cartItemId}`))
}

export async function clearCart(): Promise<void> {
  await api.delete(apiPath("cart"))
}
