export type Address = {
  id: string
  label: string | null
  recipient_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  region: string
  postal_code: string
  is_default: boolean
  created_at: string | null
  updated_at: string | null
}

export type AddressInput = {
  label?: string
  recipient_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  region: string
  postal_code: string
  is_default?: boolean
}
