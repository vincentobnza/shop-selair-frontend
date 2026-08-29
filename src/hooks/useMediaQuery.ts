import { useCallback, useSyncExternalStore } from "react"

/**
 * Subscribe to a CSS media query.
 *
 * Use this when a breakpoint has to change *what is rendered*, not just how it
 * looks. Rendering both variants and hiding one with `sm:hidden` leaves the
 * hidden copy mounted — it keeps its own state, still runs its effects, and
 * still appears in the DOM to anything that queries it.
 *
 * Prefer plain CSS for anything purely visual; this is for the cases where two
 * mounted copies would actually disagree with each other.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // No media to match during SSR/prerender; assume the small layout.
    () => false
  )
}
