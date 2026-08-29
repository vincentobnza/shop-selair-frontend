import { useQuery } from "@tanstack/react-query"

import { fetchMe, type ApiUser } from "@/features/users/api"

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
}

/**
 * The signed-in user's full record. The auth store only holds id/name/email —
 * anything else the profile header shows (such as the join date) comes from
 * here, so it is real data rather than something the UI invents.
 */
export function useMe(enabled: boolean) {
  return useQuery<ApiUser>({
    queryKey: userKeys.me(),
    queryFn: fetchMe,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
