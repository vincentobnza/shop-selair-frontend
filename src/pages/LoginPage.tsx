import { type ChangeEvent, type FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  })

  const onChange =
    (field: "email" | "password") =>
      (event: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }))
      }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-zinc-950 px-4 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.3),transparent_50%),radial-gradient(circle_at_bottom,rgba(251,146,60,0.25),transparent_45%)]" />

      <section className="relative w-full max-w-md rounded border border-white/10 bg-white/95 p-7 shadow-2xl shadow-black/35 backdrop-blur sm:p-8">
        <h1 className="mt-2 font-heading text-3xl text-zinc-900">
          Sign in to Selair
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage your rentals, orders, and saved essentials in one place.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <Input
              type="email"
              value={form.email}
              onChange={onChange("email")}
              autoComplete="email"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Password</span>
            <Input
              type="password"
              value={form.password}
              onChange={onChange("password")}
              autoComplete="current-password"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Enter your password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Confirm Password</span>
            <Input
              type="password"
              value={form.password}
              onChange={onChange("password")}
              autoComplete="confirm-password"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
              placeholder="Enter your password"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, remember: event.target.checked }))
              }
              className="h-4 w-4 rounded border-zinc-300"
            />
            Keep me signed in
          </label>

          <Button type="submit" size="lg" className="w-full rounded-xl text-sm">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-600">
          New to Selair?{" "}
          <Link to="/signup" className="font-medium text-zinc-900 hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
