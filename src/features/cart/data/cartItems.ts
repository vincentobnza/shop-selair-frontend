export type CartItem = {
  id: string
  name: string
  category: "Rent" | "Shop" | "Essentials"
  price: number
  quantity: number
}

export const cartItems: CartItem[] = [
  {
    id: "rent-midnight-tux",
    name: "Midnight Tux Rental",
    category: "Rent",
    price: 49,
    quantity: 1,
  },
  {
    id: "shop-campus-kit",
    name: "Campus Starter Kit",
    category: "Shop",
    price: 29,
    quantity: 2,
  },
  {
    id: "essentials-refill-box",
    name: "Daily Care Refill Box",
    category: "Essentials",
    price: 18,
    quantity: 1,
  },
]

export const cartItemCount = cartItems.reduce(
  (accumulator, item) => accumulator + item.quantity,
  0
)
