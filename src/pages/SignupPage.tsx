import { type FormEvent, useId, useState } from "react"
import { Link } from "react-router-dom"

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout"
import { FloatingLabelInput } from "@/components/auth/FloatingLabelInput"
import { Button } from "@/components/ui/button"
import { DotPulse } from "@/components/ui/dot-pulse"
import { useRegister } from "@/features/auth/hooks"
import { SAMPLE_DATA } from "@/dummy/sampleData"

export function SignupPage() {
  const { run: submitRegister, error, pending, clearError } = useRegister()
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmId = useId()

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
    <AuthSplitLayout
      imageSrc={SAMPLE_DATA.HeroSection.sideImageRight}
      imageAlt=""
    >
      <div className="mt-10 sm:mt-12">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-[1.75rem]">
          Sign up
        </h1>
        <p className="mt-2 max-w-sm text-base sm:text-lg leading-relaxed text-neutral-600">
          Create an account to save favorites and check out faster.
        </p>

        <form onSubmit={onSubmit} className="auth-form mt-8 space-y-3">
          {displayError ? (
            <p
              className="border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-sm text-red-800"
              role="alert"
            >
              {displayError}
            </p>
          ) : null}

          <FloatingLabelInput
            id={nameId}
            label="Full name"
            type="text"
            name="signup-name"
            value={form.name}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, name: event.target.value }))
              clearAllErrors()
            }}
            autoComplete="name"
            autoCorrect="off"
            spellCheck={false}
            required
          />

          <FloatingLabelInput
            id={emailId}
            label="Email"
            type="email"
            name="signup-email"
            value={form.email}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, email: event.target.value }))
              clearAllErrors()
            }}
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
            required
          />

          <FloatingLabelInput
            id={passwordId}
            label="Password"
            type="password"
            name="signup-password"
            value={form.password}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, password: event.target.value }))
              clearAllErrors()
            }}
            autoComplete="new-password"
            required
            minLength={8}
          />

          <FloatingLabelInput
            id={confirmId}
            label="Confirm password"
            type="password"
            name="signup-password-confirm"
            value={form.confirm}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, confirm: event.target.value }))
              clearAllErrors()
            }}
            autoComplete="new-password"
            required
            minLength={8}
          />

          <p className="text-sm sm:text-base leading-relaxed text-neutral-500">
            By signing up, you agree to our terms and privacy practices.
          </p>

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-12 sm:h-14 w-full rounded-full text-base sm:text-lg font-semibold tracking-[0.14em] uppercase"
          >
            {pending ? (
              <DotPulse label="Creating account" className="min-h-[1.25em]" />
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-base sm:text-lg text-neutral-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="ml-0.5 font-semibold text-neutral-950 underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
