import { type ChangeEvent, type FormEvent, useId, useState } from "react"
import { Link } from "react-router-dom"
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout"
import { FloatingLabelInput } from "@/components/auth/FloatingLabelInput"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { useLogin } from "@/features/auth/hooks"
import { SAMPLE_DATA } from "@/dummy/sampleData"
export function LoginPage() {
  const { run: submitLogin, error, pending, clearError } = useLogin()
  const emailId = useId()
  const passwordId = useId()
  const rememberId = useId()

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  })

  const onChange =
    (field: "email" | "password") => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      clearError()
    }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitLogin(form.email.trim(), form.password)
  }

  return (
    <AuthSplitLayout
      imageSrc={SAMPLE_DATA.HeroSection.sideImageLeft}
      imageAlt=""
    >
      <div className="mt-10 sm:mt-12">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
          Log in
        </h1>
        <p className="mt-2 max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">
          Welcome back. Sign in to manage rentals and orders.
        </p>
        <form onSubmit={onSubmit} className="auth-form mt-8 space-y-3">
          {error ? (
            <p
              className="border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-base text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <FloatingLabelInput
            id={emailId}
            label="Email"
            type="email"
            name="login-email"
            value={form.email}
            onChange={onChange("email")}
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
            required
          />

          <div className="space-y-2">
            <FloatingLabelInput
              id={passwordId}
              label="Password"
              type="password"
              name="login-password"
              value={form.password}
              onChange={onChange("password")}
              autoComplete="current-password"
              required
              minLength={8}
            />
          </div>

          <label
            htmlFor={rememberId}
            className="flex cursor-pointer items-center gap-3 text-base text-ink-soft sm:text-base"
          >
            <input
              id={rememberId}
              type="checkbox"
              checked={form.remember}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  remember: event.target.checked,
                }))
              }
              className="size-4 shrink-0 rounded-sm border-ink/30 text-ink focus:ring-ink/20"
            />
            Keep me signed in
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-12 w-full rounded-full text-base font-semibold sm:h-14 sm:text-lg"
          >
            {pending ? (
              <DotPulse label="Signing in" className="min-h-[1.25em]" />
            ) : (
              "Log in"
            )}
          </Button>
        </form>
        <p className="mt-8 text-center text-base text-ink-soft sm:text-lg">
          New to Selair?{" "}
          <Link
            to="/signup"
            className="ml-0.5 font-semibold text-ink underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
