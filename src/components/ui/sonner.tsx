import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  SpinnerIcon,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function useHtmlClassTheme(): "light" | "dark" {
  const [theme, setTheme] = React.useState<"light" | "dark">(() =>
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  )

  React.useEffect(() => {
    const el = document.documentElement
    const sync = () =>
      setTheme(el.classList.contains("dark") ? "dark" : "light")
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(el, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return theme
}

const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => {
  const theme = useHtmlClassTheme()

  return (
    <Sonner
      theme={theme}
      className={cn("toaster group font-sans", className)}
      icons={{
        success: (
          <CheckCircleIcon className="size-5 text-accent" weight="fill" />
        ),
        info: <InfoIcon className="size-5 text-foreground" weight="regular" />,
        warning: (
          <WarningIcon className="size-5 text-nav-sale" weight="fill" />
        ),
        error: (
          <XCircleIcon className="size-5 text-destructive" weight="fill" />
        ),
        loading: (
          <SpinnerIcon className="size-5 animate-spin text-muted-foreground" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: cn(
            "border-border bg-popover gap-3 border border-black! p-4 text-popover-foreground shadow-2xl!",
            "rounded-[var(--radius)]",
            toastOptions?.classNames?.toast,
          ),
          title: cn(
            "font-heading text-base! leading-snug font-medium text-foreground",
            toastOptions?.classNames?.title,
          ),
          description: cn(
            "text-sm leading-snug text-muted-foreground",
            toastOptions?.classNames?.description,
          ),
          content: cn(
            "flex min-w-0 flex-1 flex-col gap-0.5",
            toastOptions?.classNames?.content,
          ),
          icon: cn("mt-0.5 shrink-0 mr-2!", toastOptions?.classNames?.icon),
          closeButton: cn(
            "cursor-pointer border-0 bg-transparent text-muted-foreground opacity-80 transition-colors",
            "hover:bg-muted hover:text-foreground hover:opacity-100",
            "rounded-[min(var(--radius-md),10px)] p-1",
            toastOptions?.classNames?.closeButton,
          ),
          success: cn(
            "border-l-[3px] border-l-accent",
            toastOptions?.classNames?.success,
          ),
          error: cn(
            "border-l-[3px] border-l-destructive",
            toastOptions?.classNames?.error,
          ),
          warning: cn(
            "border-l-[3px] border-l-nav-sale",
            toastOptions?.classNames?.warning,
          ),
          info: cn(
            "border-l-[3px] border-l-primary",
            toastOptions?.classNames?.info,
          ),
          loading: cn(
            "border-l-[3px] border-l-muted-foreground/50",
            toastOptions?.classNames?.loading,
          ),
          default: cn(toastOptions?.classNames?.default),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
