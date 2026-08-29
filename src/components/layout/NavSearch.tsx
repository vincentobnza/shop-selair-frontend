import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type NavSearchProps = {
  /** Applied to the wrapper — controls how much room the open field may take. */
  className?: string
  /** Skip the collapsed state, for places that always have room for a field. */
  alwaysOpen?: boolean
}

/**
 * Header search. Collapsed it is just the magnifier and its label; clicking it
 * expands the field in place across the full width of its container — brand
 * magnifier, plain placeholder, a single rule underneath.
 *
 * It collapses again on Escape or on blur, but only while empty: a visitor who
 * has typed something never loses it to a stray click. Submitting hands the
 * term to `/search?q=`, which owns the query — the header keeps no results
 * state of its own, so it stays cheap to render on every route.
 */
export function NavSearch({ className, alwaysOpen = false }: NavSearchProps) {
  const inputId = useId()
  const navigate = useNavigate()
  const [open, setOpen] = useState(alwaysOpen)
  const [term, setTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  /* Focus follows the expand, so the click that opens it also starts typing. */
  useEffect(() => {
    if (open && !alwaysOpen) inputRef.current?.focus()
  }, [open, alwaysOpen])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = term.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
  }

  return (
    <div className={cn("flex min-w-0 items-center", className)}>
      {open ? (
        <form
          role="search"
          onSubmit={onSubmit}
          onBlur={(e) => {
            if (alwaysOpen || term.trim() !== "") return
            /* Only collapse once focus has actually left the field — not when
               it moves between the input and the submit button. */
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setOpen(false)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && !alwaysOpen) {
              setTerm("")
              setOpen(false)
            }
          }}
          className="flex w-full min-w-0 items-center gap-2 border-b border-brand"
        >
          <label htmlFor={inputId} className="sr-only">
            Search pieces
          </label>

          <MagnifyingGlassIcon
            size={18}
            weight="regular"
            aria-hidden
            className="shrink-0 text-brand"
          />

          <input
            id={inputId}
            ref={inputRef}
            type="search"
            name="q"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search"
            autoComplete="off"
            className="h-11 w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft [&::-webkit-search-cancel-button]:appearance-none"
          />

          {/* Enter submits; the button keeps the form usable without a keyboard. */}
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>
      ) : (
        <button
          type="button"
          aria-expanded={false}
          onClick={() => setOpen(true)}
          className="flex min-h-11 w-auto shrink-0 cursor-pointer items-center gap-2 px-1 text-base text-ink transition-colors hover:text-brand"
        >
          <MagnifyingGlassIcon size={20} weight="regular" aria-hidden />
          Search
        </button>
      )}
    </div>
  )
}
