import { create } from "zustand"
import { persist } from "zustand/middleware"

import * as authApi from "@/features/auth/api"
import type { AuthUser } from "@/features/auth/types"
import { bindAuthTokenGetter } from "@/lib/axios"

function mapUser(raw: unknown): AuthUser {
  const u = raw as Record<string, unknown>
  return {
    id: String(u.id ?? ""),
    name: String(u.name ?? ""),
    email: String(u.email ?? ""),
  }
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const data = await authApi.login({ email, password })
        set({ token: data.token, user: mapUser(data.user) })
      },

      register: async (input) => {
        const data = await authApi.register(input)
        set({ token: data.token, user: mapUser(data.user) })
      },

      logout: async () => {
        const token = get().token
        if (token) {
          try {
            await authApi.logout()
          } catch {
            /* still clear local session */
          }
        }
        set({ token: null, user: null })
      },
    }),
    {
      name: "selair-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)

bindAuthTokenGetter(() => useAuthStore.getState().token)

export function useAuth() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  return {
    isAuthenticated: Boolean(token && user),
    token,
    user,
    logout,
  }
}
