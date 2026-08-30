import { useCallback, useState } from "react"

import {
  ConfirmDialog,
  type ConfirmOptions,
} from "@/components/ui/confirm-dialog"

/**
 * Ask before doing something irreversible:
 *
 *     const { confirm, dialog } = useConfirm()
 *     if (await confirm({ title: "Cancel this order?" })) cancel()
 *     …
 *     {dialog}
 *
 * The promise resolves false on cancel, Escape or a click outside, so the
 * caller only ever has one path to check — which is what makes this readable at
 * the call site in a way a pair of `useState` flags is not.
 *
 * Mirrors the admin console's hook of the same name, so the two apps ask the
 * same question the same way.
 */
export function useConfirm() {
  const [request, setRequest] = useState<{
    options: ConfirmOptions
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setRequest({ options, resolve })),
    []
  )

  const dialog = (
    <ConfirmDialog
      open={request !== null}
      /* Radix keeps the node mounted while it animates out; the fallback title
         exists only for that frame and is never read aloud. */
      {...(request?.options ?? { title: "" })}
      onResolve={(confirmed) => {
        request?.resolve(confirmed)
        setRequest(null)
      }}
    />
  )

  return { confirm, dialog }
}
