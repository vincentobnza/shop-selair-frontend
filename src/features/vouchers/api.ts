import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"

export type VoucherPreview = {
  code: string
  type: "percent" | "fixed"
  value: number
  min_subtotal_cents: number
  max_discount_cents: number | null
  discount_cents: number
}

/** Validate a voucher against a subtotal; throws ApiError(422) when invalid. */
export async function previewVoucher(
  code: string,
  subtotalCents: number
): Promise<VoucherPreview> {
  const res = await api.post<{ data: VoucherPreview }>(
    apiPath("vouchers/preview"),
    {
      code,
      subtotal_cents: subtotalCents,
    }
  )
  return res.data.data
}
