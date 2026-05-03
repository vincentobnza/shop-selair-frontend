export type ApiProduct = {
  id: number
  name: string
  sku: string
  description?: string | null
  price_cents: number
  stock: number
  is_active: boolean
}

export type ApiCartLine = {
  id: number
  user_id: string
  product_id: number
  quantity: number
  product: ApiProduct
}

export type CartPayload = {
  items: ApiCartLine[]
  item_count: number
  subtotal_cents: number
}
