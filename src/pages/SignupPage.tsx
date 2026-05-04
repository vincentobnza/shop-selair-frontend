import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/features/auth/hooks"

export function SignupPage() {
  const { run: submitRegister, error, pending, clearError } = useRegister()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [clientError, setClientError] = useState<string | null>(null)

  const displayError = clientError ?? error

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setClientError(null)
    clearError()

    if (form.password !== form.confirm) {
      setClientError("Passwords do not match.")
      return
    }

    void submitRegister({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.confirm,
    })
  }

  const clearAllErrors = () => {
    setClientError(null)
    clearError()
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-zinc-950 px-4 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.28),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.22),transparent_40%)]" />

      <section className="relative w-full max-w-md rounded border border-white/10 bg-white/95 p-7 shadow-2xl shadow-black/35 backdrop-blur sm:p-8">
        <h1 className="mt-2 font-heading text-3xl text-zinc-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Start booking standout looks and keep your picks in sync.
        </p>

        <form
          onSubmit={onSubmit}
          className="auth-form mt-7 space-y-4"
          autoComplete="off"
        >
          {displayError ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {displayError}
            </p>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Full name</span>
            <Input
              type="text"
              name="signup-name"
              value={form.name}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, name: event.target.value }))
                clearAllErrors()
              }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Enter your full name"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <Input
              type="email"
              name="signup-email"
              value={form.email}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, email: event.target.value }))
                clearAllErrors()
              }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Enter your email"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Password</span>
            <Input
              type="password"
              name="signup-password"
              value={form.password}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, password: event.target.value }))
                clearAllErrors()
              }}
              autoComplete="off"
              required
              minLength={8}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Enter your password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">
              Confirm password
            </span>
            <Input
              type="password"
              name="signup-password-confirm"
              value={form.confirm}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, confirm: event.target.value }))
                clearAllErrors()
              }}
              autoComplete="off"
              required
              minLength={8}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Confirm your password"
            />
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="w-full rounded-xl text-sm"
          >
            {pending ? (
              <DotPulse label="Creating account" className="min-h-[1.25em]" />
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-zinc-900 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
