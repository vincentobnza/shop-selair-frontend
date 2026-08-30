import { useEffect, useState } from "react"
import { CaretDownIcon, XIcon } from "@phosphor-icons/react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BRAND } from "@/config/brand"
import { cn } from "@/lib/utils"
import {
  countActiveRefinements,
  SORT_OPTIONS,
  type ShopRefinements,
  type SortId,
} from "./shop-refinements"

const peso = new Intl.NumberFormat(BRAND.locale, {
  style: "currency",
  currency: BRAND.currency,
  maximumFractionDigits: 0,
})

export type ShopFilterBarProps = {
  refinements: ShopRefinements
  onChange: (next: Partial<ShopRefinements>) => void
  onClear: () => void
  /** Size labels the catalogue actually offers — never a hard-coded list. */
  sizes: string[]
  bounds: { min: number; max: number }
  resultCount: number
}

/**
 * Price, size, availability and sort, as a row of popovers under the
 * collection pills.
 *
 * Each control writes straight to the URL through `onChange`, so the grid, the
 * count and the address bar can never disagree, and a filtered shop is
 * shareable. The active refinements are repeated as removable chips beneath —
 * a popover that is closed hides its own state, and a grid that has silently
 * dropped half the catalogue with no visible reason is the single most common
 * way faceted search confuses people.
 */
export function ShopFilterBar({
  refinements,
  onChange,
  onClear,
  sizes,
  bounds,
  resultCount,
}: ShopFilterBarProps) {
  const activeCount = countActiveRefinements(refinements)
  const sortLabel =
    SORT_OPTIONS.find((o) => o.id === refinements.sort)?.label ?? "Featured"

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PriceFilter
          refinements={refinements}
          onChange={onChange}
          bounds={bounds}
        />

        {sizes.length > 0 ? (
          <SizeFilter
            selected={refinements.sizes}
            options={sizes}
            onChange={(next) => onChange({ sizes: next })}
          />
        ) : null}

        {/*
          A toggle, not a popover: it is one boolean, and burying a single
          checkbox behind a click is worse than showing it.
        */}
        <button
          type="button"
          aria-pressed={refinements.inStockOnly}
          onClick={() => onChange({ inStockOnly: !refinements.inStockOnly })}
          className={cn(
            "flex min-h-9 shrink-0 items-center rounded-full border px-4 text-base transition-colors",
            refinements.inStockOnly
              ? "border-brand bg-brand text-white"
              : "border-ink/20 text-ink hover:border-ink/40"
          )}
        >
          Available now
        </button>

        <FilterPopover
          label="Sort"
          value={refinements.sort === "featured" ? null : sortLabel}
        >
          <fieldset className="flex flex-col gap-1">
            <legend className="sr-only">Sort pieces by</legend>
            {SORT_OPTIONS.map((option) => (
              <OptionRow
                key={option.id}
                label={option.label}
                selected={refinements.sort === option.id}
                onSelect={() => onChange({ sort: option.id as SortId })}
              />
            ))}
          </fieldset>
        </FilterPopover>
      </div>

      {activeCount > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {refinements.minPrice !== null || refinements.maxPrice !== null ? (
            <ActiveChip
              label={priceChipLabel(refinements)}
              onRemove={() => onChange({ minPrice: null, maxPrice: null })}
            />
          ) : null}

          {refinements.sizes.map((size) => (
            <ActiveChip
              key={size}
              label={`Size ${size}`}
              onRemove={() =>
                onChange({
                  sizes: refinements.sizes.filter((s) => s !== size),
                })
              }
            />
          ))}

          {refinements.inStockOnly ? (
            <ActiveChip
              label="Available now"
              onRemove={() => onChange({ inStockOnly: false })}
            />
          ) : null}

          <button
            type="button"
            onClick={onClear}
            className="min-h-8 cursor-pointer px-2 text-base text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Clear all
          </button>

          {/* Announced rather than only drawn, so the effect of a filter is
              audible to someone who cannot see the grid change. */}
          <span className="sr-only" role="status">
            {resultCount} {resultCount === 1 ? "piece" : "pieces"} match your
            filters
          </span>
        </div>
      ) : null}
    </div>
  )
}

function priceChipLabel(r: ShopRefinements): string {
  if (r.minPrice !== null && r.maxPrice !== null) {
    return `${peso.format(r.minPrice)} – ${peso.format(r.maxPrice)}`
  }
  if (r.minPrice !== null) return `${peso.format(r.minPrice)} and up`
  return `Under ${peso.format(r.maxPrice ?? 0)}`
}

/** Trigger + panel, shared by every popover-backed facet. */
function FilterPopover({
  label,
  value,
  children,
}: {
  label: string
  /** The current selection, shown on the trigger. Null reads as untouched. */
  value: string | null
  children: React.ReactNode
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-base transition-colors",
          value
            ? "border-brand text-brand"
            : "border-ink/20 text-ink hover:border-ink/40"
        )}
      >
        {value ?? label}
        <CaretDownIcon size={14} weight="bold" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="center">{children}</PopoverContent>
    </Popover>
  )
}

function PriceFilter({
  refinements,
  onChange,
  bounds,
}: {
  refinements: ShopRefinements
  onChange: (next: Partial<ShopRefinements>) => void
  bounds: { min: number; max: number }
}) {
  /*
   * Local draft, committed on Apply rather than on every keystroke.
   *
   * Typing "1500" passes through 1, 15 and 150 — filtering live would empty
   * the grid twice on the way to a valid number, and each pass writes a URL
   * entry the back button then has to walk through.
   */
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  // Re-sync when the URL changes underneath (back button, chip removal).
  useEffect(() => {
    setMin(refinements.minPrice === null ? "" : String(refinements.minPrice))
    setMax(refinements.maxPrice === null ? "" : String(refinements.maxPrice))
  }, [refinements.minPrice, refinements.maxPrice])

  const commit = () => {
    const parse = (raw: string) => {
      const value = Number(raw)
      return raw.trim() === "" || !Number.isFinite(value) || value < 0
        ? null
        : value
    }
    onChange({ minPrice: parse(min), maxPrice: parse(max) })
  }

  return (
    <FilterPopover label="Price" value={priceTriggerValue(refinements)}>
      <p className="text-base font-semibold text-ink">Price per rental</p>
      <p className="text-sm text-ink-soft">
        Pieces run {peso.format(bounds.min)} to {peso.format(bounds.max)}.
      </p>

      <div className="mt-2 flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">Minimum price</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder={String(bounds.min)}
            className="h-10 w-full rounded-full border border-ink/20 px-4 text-base text-ink outline-none focus:border-brand"
          />
        </label>
        <span aria-hidden className="text-ink-soft">
          –
        </span>
        <label className="flex-1">
          <span className="sr-only">Maximum price</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder={String(bounds.max)}
            className="h-10 w-full rounded-full border border-ink/20 px-4 text-base text-ink outline-none focus:border-brand"
          />
        </label>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={commit}
          className="min-h-10 flex-1 cursor-pointer rounded-full bg-brand text-base font-medium text-white transition-opacity hover:opacity-90"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={() => {
            setMin("")
            setMax("")
            onChange({ minPrice: null, maxPrice: null })
          }}
          className="min-h-10 cursor-pointer px-4 text-base text-ink-soft hover:text-ink"
        >
          Clear
        </button>
      </div>
    </FilterPopover>
  )
}

function priceTriggerValue(r: ShopRefinements): string | null {
  if (r.minPrice === null && r.maxPrice === null) return null
  return priceChipLabel(r)
}

function SizeFilter({
  selected,
  options,
  onChange,
}: {
  selected: string[]
  options: string[]
  onChange: (next: string[]) => void
}) {
  const toggle = (size: string) =>
    onChange(
      selected.includes(size)
        ? selected.filter((s) => s !== size)
        : [...selected, size]
    )

  return (
    <FilterPopover
      label="Size"
      value={selected.length > 0 ? selected.join(", ") : null}
    >
      <p className="text-base font-semibold text-ink">Size</p>
      <p className="text-sm text-ink-soft">
        Shows pieces with that size free to book.
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((size) => {
          const active = selected.includes(size)
          return (
            <button
              key={size}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(size)}
              className={cn(
                "min-h-10 min-w-12 cursor-pointer rounded-full border px-3 text-base transition-colors",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-ink/20 text-ink hover:border-ink/40"
              )}
            >
              {size}
            </button>
          )
        })}
      </div>

      {selected.length > 0 ? (
        <button
          type="button"
          onClick={() => onChange([])}
          className="mt-2 min-h-10 cursor-pointer text-base text-ink-soft hover:text-ink"
        >
          Clear sizes
        </button>
      ) : null}
    </FilterPopover>
  )
}

function OptionRow({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "overlay-item",
        selected && "font-semibold text-brand hover:bg-pink-light"
      )}
    >
      {label}
    </button>
  )
}

function ActiveChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-pink-light px-3 text-base text-ink">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="cursor-pointer rounded-full p-0.5 text-ink-soft transition-colors hover:text-ink"
      >
        <XIcon size={14} weight="bold" aria-hidden />
      </button>
    </span>
  )
}
