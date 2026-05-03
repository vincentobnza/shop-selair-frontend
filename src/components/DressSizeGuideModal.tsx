import { XIcon } from "@phosphor-icons/react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const brandUsRows: { brand: string; us: string }[] = [
  { brand: "XS", us: "0–2" },
  { brand: "S", us: "4" },
  { brand: "M", us: "6–8" },
  { brand: "L", us: "10" },
  { brand: "XL", us: "12–14" },
]

type DressSizeGuideModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DressSizeGuideModal({
  open,
  onOpenChange,
}: DressSizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl rounded-none! p-0! border! border-black!">
        <div className="relative pr-10 p-4 bg-amber-900 text-white">
          <DialogTitle className="font-heading text-center text-2xl font-medium tracking-tight text-white">
            Dress To Size Guide
          </DialogTitle>
          <DialogClose
            type="button"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 right-3 flex size-10 touch-manipulation items-center justify-center rounded-md text-white",
              "outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white",
            )}
            aria-label="Close size guide"
          >
            <XIcon className="size-5" weight="bold" />
          </DialogClose>
        </div>

        <div className="mt-8 space-y-2 text-[15px] leading-relaxed text-zinc-800 px-4 py-5">
          <section className="space-y-1">
            <h3 className="text-xs sm:text-sm md:text-base">
              Fit details
            </h3>
            <p className="text-xs sm:text-sm">
              <span className="font-semibold text-zinc-900">Sized:</span> XS–XL
            </p>
            <p className="text-xs sm:text-sm">
              The model is wearing a size small and is 5&apos;8.5&quot;.
            </p>
          </section>

          <div className="h-px bg-zinc-200" />

          <section>
            <h3 className="text-base sm:text-lg font-heading font-bold tracking-[0.12em] text-zinc-800 ">
              Product sizing
            </h3>
            <div className="mt-4 overflow-hidden border border-black/10">
              <table className="w-full border-collapse text-sm">
                <thead className="border-b border-black/10">
                  <tr className="bg-muted text-black">
                    <th className="p-2 text-left text-xs sm:text-sm font-bold tracking-wide ">
                      Brand size
                    </th>
                    <th className="px-4 py-2 text-right text-xs sm:text-sm font-bold tracking-wide ">
                      US
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brandUsRows.map((row, i) => (
                    <tr
                      key={row.brand}
                      className={cn(
                        i % 2 === 1 ? "bg-neutral-100" : "bg-white",
                        "border-t border-zinc-100 first:border-t-0",
                      )}
                    >
                      <td className="px-4 py-2 font-semibold text-black">
                        {row.brand}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-black font-semibold">
                        {row.us}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
