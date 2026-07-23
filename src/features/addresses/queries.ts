import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import * as addressesApi from "./api"
import type { AddressInput } from "./types"

export const addressKeys = {
  all: ["addresses"] as const,
  list: () => [...addressKeys.all, "list"] as const,
}

export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: () => addressesApi.fetchAddresses(),
    enabled,
  })
}

export function useCreateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AddressInput) => addressesApi.createAddress(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.list() }),
  })
}

export function useUpdateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AddressInput> }) =>
      addressesApi.updateAddress(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.list() }),
  })
}

export function useSetDefaultAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => addressesApi.setDefaultAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.list() }),
  })
}

export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => addressesApi.deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.list() }),
  })
}
