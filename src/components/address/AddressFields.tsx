import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type AddressFormValue = {
  label: string
  recipient_name: string
  phone: string
  line1: string
  line2: string
  city: string
  region: string
  postal_code: string
}

export const EMPTY_ADDRESS: AddressFormValue = {
  label: "",
  recipient_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postal_code: "",
}

type Props = {
  value: AddressFormValue
  onChange: (patch: Partial<AddressFormValue>) => void
  errors?: Record<string, string[]>
  /** Show the optional "label" field (Home/Office). */
  showLabel?: boolean
}

const inputClass = "h-11"

export function AddressFields({ value, onChange, errors = {}, showLabel = true }: Props) {
  const field = (
    key: keyof AddressFormValue,
    label: string,
    opts: { required?: boolean; autoComplete?: string; type?: string; placeholder?: string } = {},
  ) => (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-800">
        {label}
        {!opts.required ? <span className="font-normal text-zinc-500"> (optional)</span> : null}
      </span>
      <Input
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        value={value[key]}
        placeholder={opts.placeholder}
        onChange={(e) => onChange({ [key]: e.target.value })}
        className={cn(inputClass)}
        aria-invalid={Boolean(errors[key]?.length)}
      />
      {errors[key]?.[0] ? (
        <span className="block text-xs text-red-700">{errors[key][0]}</span>
      ) : null}
    </label>
  )

  return (
    <div className="grid gap-4">
      {showLabel ? field("label", "Label", { placeholder: "Home, Office…" }) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("recipient_name", "Full name", { required: true, autoComplete: "name" })}
        {field("phone", "Mobile number", { required: true, autoComplete: "tel", type: "tel", placeholder: "+63 …" })}
      </div>
      {field("line1", "Address line 1", { required: true, autoComplete: "address-line1", placeholder: "Street, building, unit" })}
      {field("line2", "Address line 2", { autoComplete: "address-line2" })}
      <div className="grid gap-4 sm:grid-cols-3">
        {field("city", "City", { required: true, autoComplete: "address-level2" })}
        {field("region", "Province / Region", { required: true, autoComplete: "address-level1" })}
        {field("postal_code", "Postal code", { required: true, autoComplete: "postal-code" })}
      </div>
    </div>
  )
}

/** Validates the required fields client-side; returns a field→messages map. */
export function validateAddress(value: AddressFormValue): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  const required: (keyof AddressFormValue)[] = [
    "recipient_name",
    "phone",
    "line1",
    "city",
    "region",
    "postal_code",
  ]
  for (const key of required) {
    if (!value[key] || value[key].trim() === "") {
      errors[key] = ["This field is required."]
    }
  }
  return errors
}
