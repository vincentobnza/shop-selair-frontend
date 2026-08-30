import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

import { toUserMessage } from "@/features/auth/errors"
import { useAuthStore } from "@/features/auth/store"
import { toast } from "sonner"

export { useAuth } from "@/features/auth/store"

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const run = useCallback(
    async (email: string, password: string) => {
      setError(null)
      setPending(true)
      try {
        await login(email, password)
        navigate("/", { replace: true })
      } catch (e) {
        const message = toUserMessage(e)
        setError(message)
        /* No fixed description: the same path now carries "invalid
           credentials", "we could not verify this request" and "the security
           check could not run", and asserting one of them for all three sends
           people looking in the wrong place. */
        toast.error(message)
      } finally {
        setPending(false)
      }
    },
    [login, navigate]
  )

  const clearError = useCallback(() => setError(null), [])

  return { run, error, pending, clearError }
}

export function useRegister() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const run = useCallback(
    async (input: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => {
      setError(null)
      setPending(true)
      try {
        await register(input)
        navigate("/", { replace: true })
      } catch (e) {
        const message = toUserMessage(e)
        setError(message)
        /* No fixed description: the same path now carries "invalid
           credentials", "we could not verify this request" and "the security
           check could not run", and asserting one of them for all three sends
           people looking in the wrong place. */
        toast.error(message)
      } finally {
        setPending(false)
      }
    },
    [navigate, register]
  )

  const clearError = useCallback(() => setError(null), [])

  return { run, error, pending, clearError }
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const [pending, setPending] = useState(false)

  const run = useCallback(async () => {
    setPending(true)
    try {
      await logout()
    } finally {
      setPending(false)
    }
  }, [logout])

  return { run, pending }
}
