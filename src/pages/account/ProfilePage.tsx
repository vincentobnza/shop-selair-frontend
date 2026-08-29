import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiError, toUserMessage } from "@/features/auth/errors"
import { useAuth } from "@/features/auth/hooks"
import { useAuthStore } from "@/features/auth/store"
import { updateProfile } from "@/features/users/api"
import { AvatarPicker } from "@/components/account/AvatarPicker"
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
        const body = err.body as
          | { errors?: Record<string, string[]> }
          | undefined
        setErrors(body?.errors ?? {})
      }
      toast.error(toUserMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <AvatarPicker
          id={user?.id}
          name={user?.name ?? ""}
          avatarUrl={user?.avatar_url}
        />
      </section>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-[1.75rem] bg-white p-6 sm:p-8"
      >
        <div>
          <h2 className="font-heading text-2xl font-medium text-ink">
            Your details
          </h2>
          <p className="mt-1 text-base text-ink-soft">
            The name and email we use for bookings and fitting reminders.
          </p>
        </div>

        <Field label="Full name" error={errors.name?.[0]}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base"
          />
        </Field>
        <Field label="Email" error={errors.email?.[0]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base"
          />
        </Field>

        <Button
          type="submit"
          variant="pill"
          disabled={!dirty || pending}
          className="h-12 px-10 text-base font-semibold"
        >
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
      <span className="text-base font-semibold text-ink">{label}</span>
      {children}
      {error ? (
        <span className="block text-base text-brand">{error}</span>
      ) : null}
    </label>
  )
}
