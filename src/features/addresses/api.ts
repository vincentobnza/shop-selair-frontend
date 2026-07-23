import { apiPath } from "@/lib/api-base"
import { api } from "@/lib/axios"
import type { Address, AddressInput } from "./types"

export async function fetchAddresses(): Promise<Address[]> {
  const res = await api.get<{ data: Address[] }>(apiPath("addresses"))
  return res.data.data
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const res = await api.post<{ data: Address }>(apiPath("addresses"), input)
  return res.data.data
}

export async function updateAddress(id: string, input: Partial<AddressInput>): Promise<Address> {
  const res = await api.put<{ data: Address }>(apiPath(`addresses/${id}`), input)
  return res.data.data
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const res = await api.patch<{ data: Address }>(apiPath(`addresses/${id}/default`))
  return res.data.data
}

export async function deleteAddress(id: string): Promise<void> {
  await api.delete(apiPath(`addresses/${id}`))
}
