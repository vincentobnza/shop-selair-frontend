export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"

export type PaymentMethod = "cod" | "online"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export type OrderItem = {
  id: string
  product_id: string | null
  product_name: string
  sku: string
  image_url: string | null
  unit_price_cents: number
  quantity: number
  size_label: string | null
  rental_start: string | null
  rental_end: string | null
  subtotal_cents: number
}

export type ShippingAddress = {
  recipient_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  region: string
  postal_code: string
}

export type Order = {
  id: string
  order_number: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  subtotal_cents: number
  discount_cents: number
  shipping_cents: number
  total_cents: number
  voucher_code: string | null
  shipping_address: ShippingAddress
  notes: string | null
  placed_at: string | null
  cancelled_at: string | null
  items: OrderItem[]
}

export type CreateOrderInput = {
  payment_method: PaymentMethod
  address_id?: string
  recipient_name?: string
  phone?: string
  line1?: string
  line2?: string
  city?: string
  region?: string
  postal_code?: string
  save_address?: boolean
  voucher_code?: string
  notes?: string
  rentals?: { cart_item_id: number; rental_start: string; rental_end: string }[]
}
