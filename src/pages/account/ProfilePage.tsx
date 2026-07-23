import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiError, toUserMessage } from "@/features/auth/errors"
import { useAuth } from "@/features/auth/hooks"
import { useAuthStore } from "@/features/auth/store"
import { updateProfile } from "@/features/users/api"

export function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [pending, setPending] = useState(false)

  const dirty = name !== (user?.name ?? "") || email !== (user?.email ?? "")

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setErrors({})
    setPending(true)
    try {
      const updated = await updateProfile(user.id, { name, email })
      useAuthStore.setState({
        user: { id: updated.id, name: updated.name, email: updated.email },
      })
      toast.success("Profile updated.")
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { errors?: Record<string, string[]> } | undefined
        setErrors(body?.errors ?? {})
      }
      toast.error(toUserMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-heading text-xl font-medium text-zinc-900">Profile</h2>

      <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <Field label="Full name" error={errors.name?.[0]}>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
        </Field>
        <Field label="Email" error={errors.email?.[0]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />
        </Field>
        <Button type="submit" disabled={!dirty || pending} className="rounded-full px-8">
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red-700">{error}</span> : null}
    </label>
  )
}
