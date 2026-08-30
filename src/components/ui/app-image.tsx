import type { ComponentProps } from "react"

/*
 * `ComponentProps<"img">` rather than `ImgHTMLAttributes` so a caller can pass
 * `ref`: the zoom loupe reads `naturalWidth`/`naturalHeight` off the element,
 * and the photo sheet drives its transform on it imperatively.
 */
export type AppImageProps = ComponentProps<"img"> & {
  /** Above-the-fold / LCP: eager load + high fetch priority */
  priority?: boolean
}

export function AppImage({
  priority,
  className,
  decoding,
  loading,
  fetchPriority,
  ...rest
}: AppImageProps) {
  return (
    <img
      className={className}
      decoding={decoding ?? "async"}
      loading={priority ? "eager" : (loading ?? "lazy")}
      fetchPriority={priority ? "high" : (fetchPriority ?? "auto")}
      {...rest}
    />
  )
}
