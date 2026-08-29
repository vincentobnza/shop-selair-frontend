import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { useState, type ComponentProps } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
export type FloatingLabelInputProps = Omit<
  ComponentProps<typeof Input>,
  "placeholder"
> & {
  label: string
}

export function FloatingLabelInput({
  label,
  id,
  className,
  value,
  onFocus,
  onBlur,
  type = "text",
  ...rest
}: FloatingLabelInputProps) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const str = value == null ? "" : String(value)
  const floated = focused || str.length > 0
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className="relative">
      <Input
        id={id}
        type={inputType}
        value={value}
        placeholder=" "
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        className={cn(
          "h-12 min-h-12 w-full rounded-full border border-line bg-white px-5 pt-[1.35rem] pb-2 text-base leading-normal text-ink shadow-none sm:h-14 sm:min-h-14 sm:pt-7 sm:pb-2.5 sm:text-lg md:text-lg",
          isPassword && "pr-12 sm:pr-14",
          "placeholder:text-transparent",
          "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ink/15",
          className
        )}
        {...rest}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-5 origin-left font-sans text-ink-soft transition-[top,transform,font-size] duration-200 ease-out",
          floated
            ? "top-3 translate-y-0 text-[0.75rem] leading-tight sm:top-2 sm:text-base"
            : "top-1/2 -translate-y-1/2 text-base sm:text-lg"
        )}
      >
        {label}
      </label>
      {isPassword ? (
        <button
          type="button"
          className="absolute top-1/2 right-0.5 z-10 flex size-11 -translate-y-1/2 cursor-pointer touch-manipulation items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-pink-light focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:outline-none sm:right-1"
          aria-label={!showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((v) => !v)}
        >
          {!showPassword ? (
            <EyeSlashIcon
              className="size-5 sm:size-[1.35rem]"
              weight="regular"
            />
          ) : (
            <EyeIcon className="size-5 sm:size-[1.35rem]" weight="regular" />
          )}
        </button>
      ) : null}
    </div>
  )
}
