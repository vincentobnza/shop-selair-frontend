import { useState } from "react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { toUserMessage } from "@/features/auth/errors"
import { useAuth } from "@/features/auth/hooks"
import { useAuthStore } from "@/features/auth/store"
import { api } from "@/lib/axios"
import { apiPath } from "@/lib/api-base"
export function SettingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)

  const deactivate = async () => {
    if (!user) return
    setPending(true)
    try {
      await api.patch(apiPath(`users/${user.id}/deactivate`))
      useAuthStore.setState({ token: null, user: null })
      toast.success("Your account has been deactivated.")
      navigate("/", { replace: true })
    } catch (e) {
      toast.error(toUserMessage(e))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-medium text-ink">Settings</h2>{" "}
      <div className="divide-y divide-line rounded-sm bg-white">
        <SettingLink
          to="/account/profile"
          title="Profile"
          subtitle="Update your name and email"
        />
        <SettingLink
          to="/account/addresses"
          title="Addresses"
          subtitle="Manage your delivery addresses"
        />
        <SettingLink
          to="/account/notifications"
          title="Notifications"
          subtitle="Order updates and promotions"
        />
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50/40 p-5">
        <h3 className="text-base font-medium text-red-900">
          Deactivate account
        </h3>{" "}
        <p className="mt-1 text-base text-red-700/90">
          This disables your account and signs you out. You can reactivate by
          contacting support.
        </p>
        {confirming ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={deactivate}
              disabled={pending}
            >
              {pending ? "Deactivating…" : "Yes, deactivate"}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="mt-4 rounded-full text-red-700 hover:bg-red-50"
            onClick={() => setConfirming(true)}
          >
            Deactivate account
          </Button>
        )}
      </div>
    </div>
  )
}

function SettingLink({
  to,
  title,
  subtitle,
}: {
  to: string
  title: string
  subtitle: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-5 py-4 hover:bg-pink-light"
    >
      <div>
        <p className="text-base font-medium text-ink">{title}</p>{" "}
        <p className="text-base text-ink-soft">{subtitle}</p>
      </div>
      <CaretRightIcon size={18} className="text-ink-soft" />
    </Link>
  )
}
