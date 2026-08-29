import type { ImgHTMLAttributes } from "react"
export type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
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
