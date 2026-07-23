import { useState } from "react"
import { MapPinIcon, PlusIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import {
  AddressFields,
  EMPTY_ADDRESS,
  validateAddress,
  type AddressFormValue,
} from "@/components/address/AddressFields"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { toUserMessage } from "@/features/auth/errors"
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/features/addresses/queries"
import type { Address } from "@/features/addresses/types"

export function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses()
  const create = useCreateAddress()
  const update = useUpdateAddress()
  const setDefault = useSetDefaultAddress()
  const remove = useDeleteAddress()

  const [editing, setEditing] = useState<Address | "new" | null>(null)
  const [form, setForm] = useState<AddressFormValue>(EMPTY_ADDRESS)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const openNew = () => {
    setForm(EMPTY_ADDRESS)
    setErrors({})
    setEditing("new")
  }

  const openEdit = (a: Address) => {
    setForm({
      label: a.label ?? "",
      recipient_name: a.recipient_name,
      phone: a.phone,
      line1: a.line1,
      line2: a.line2 ?? "",
      city: a.city,
      region: a.region,
      postal_code: a.postal_code,
    })
    setErrors({})
    setEditing(a)
  }

  const submit = async () => {
    const v = validateAddress(form)
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }
    const payload = {
      label: form.label || undefined,
      recipient_name: form.recipient_name,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      region: form.region,
      postal_code: form.postal_code,
    }
    try {
      if (editing === "new") {
        await create.mutateAsync(payload)
        toast.success("Address saved.")
      } else if (editing) {
        await update.mutateAsync({ id: editing.id, input: payload })
        toast.success("Address updated.")
      }
      setEditing(null)
    } catch (e) {
      toast.error(toUserMessage(e))
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <DotPulse />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-medium text-zinc-900">Addresses</h2>
        {editing === null ? (
          <Button variant="outline" className="rounded-full" onClick={openNew}>
            <PlusIcon size={16} /> Add address
          </Button>
        ) : null}
      </div>

      {editing !== null ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h3 className="mb-4 font-heading text-base font-medium text-zinc-900">
            {editing === "new" ? "New address" : "Edit address"}
          </h3>
          <AddressFields
            value={form}
            onChange={(patch) => setForm((s) => ({ ...s, ...patch }))}
            errors={errors}
          />
          <div className="mt-5 flex gap-3">
            <Button
              className="rounded-full px-8"
              onClick={submit}
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending ? "Saving…" : "Save address"}
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {!addresses || addresses.length === 0 ? (
        editing === null ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-neutral-200 bg-zinc-50 px-6 py-16 text-center">
            <MapPinIcon size={40} className="text-zinc-300" />
            <p className="mt-3 font-heading text-lg text-zinc-900">No saved addresses</p>
            <p className="mt-1 text-sm text-zinc-600">Add one to speed up checkout.</p>
          </div>
        ) : null
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-900">
                  {a.label || "Address"}
                </span>
                {a.is_default ? (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-white">
                    Default
                  </span>
                ) : null}
              </div>
              <address className="mt-2 text-sm text-zinc-600 not-italic">
                <span className="font-medium text-zinc-900">{a.recipient_name}</span>
                <br />
                {a.phone}
                <br />
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.region} {a.postal_code}
              </address>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 text-sm">
                <button
                  className="font-medium text-zinc-700 hover:text-zinc-900"
                  onClick={() => openEdit(a)}
                >
                  Edit
                </button>
                {!a.is_default ? (
                  <>
                    <span className="text-zinc-300">·</span>
                    <button
                      className="font-medium text-zinc-700 hover:text-zinc-900"
                      onClick={() =>
                        setDefault.mutate(a.id, {
                          onSuccess: () => toast.success("Default address set."),
                          onError: (e) => toast.error(toUserMessage(e)),
                        })
                      }
                    >
                      Set default
                    </button>
                    <span className="text-zinc-300">·</span>
                    <button
                      className="font-medium text-red-700 hover:text-red-800"
                      onClick={() =>
                        remove.mutate(a.id, {
                          onSuccess: () => toast.success("Address removed."),
                          onError: (e) => toast.error(toUserMessage(e)),
                        })
                      }
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
