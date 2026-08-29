import { useState } from "react"
import { PlusIcon } from "@phosphor-icons/react"
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
import { EmptyState } from "@/components/ui/empty-state"
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
        <h2 className="text-xl font-medium text-ink">Addresses</h2>
        {editing === null ? (
          <Button variant="outline" className="rounded-full" onClick={openNew}>
            <PlusIcon size={16} /> Add address
          </Button>
        ) : null}
      </div>
      {editing !== null ? (
        <div className="rounded-sm bg-white p-5 sm:p-6">
          <h3 className="mb-4 text-base font-medium text-ink">
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
              {create.isPending || update.isPending
                ? "Saving…"
                : "Save address"}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {!addresses || addresses.length === 0 ? (
        editing === null ? (
          <EmptyState
            art="pin"
            title="No saved addresses"
            description="Save an address to speed up checkout and delivery."
          />
        ) : null
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-sm bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-ink">
                  {a.label || "Address"}
                </span>
                {a.is_default ? (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-base font-medium text-white">
                    Default
                  </span>
                ) : null}
              </div>
              <address className="mt-2 text-base text-ink-soft not-italic">
                <span className="font-medium text-ink">{a.recipient_name}</span>
                <br />
                {a.phone}
                <br />
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.region} {a.postal_code}
              </address>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3 text-base">
                <button
                  className="font-medium text-ink-soft hover:text-ink"
                  onClick={() => openEdit(a)}
                >
                  Edit
                </button>
                {!a.is_default ? (
                  <>
                    <span className="text-line">·</span>
                    <button
                      className="font-medium text-ink-soft hover:text-ink"
                      onClick={() =>
                        setDefault.mutate(a.id, {
                          onSuccess: () =>
                            toast.success("Default address set."),
                          onError: (e) => toast.error(toUserMessage(e)),
                        })
                      }
                    >
                      Set default
                    </button>
                    <span className="text-line">·</span>
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
