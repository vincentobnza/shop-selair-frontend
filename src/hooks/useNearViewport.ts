import { useEffect, useRef, useState } from "react"

/** True once the element intersects (with `rootMargin`), one-shot. */
export function useNearViewport(rootMargin = "320px") {
  const ref = useRef<HTMLElement | null>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return { ref, near }
}
