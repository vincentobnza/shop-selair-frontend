import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Full name</span>
            <Input
              type="text"
              name="signup-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Vincent Selair"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <Input
              type="email"
              name="signup-email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Password</span>
            <Input
              type="password"
              name="signup-password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              autoComplete="off"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Create a password"
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
              onChange={(event) =>
                setForm((prev) => ({ ...prev, confirm: event.target.value }))
              }
              autoComplete="off"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Repeat password"
            />
          </label>

          <Button type="submit" size="lg" className="w-full rounded-xl text-sm">
            Create account
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
