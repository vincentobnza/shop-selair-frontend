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
      <DialogContent className="rounded-none! border! border-line! p-0! sm:max-w-4xl">
        <div className="relative bg-amber-900 p-4 pr-10 text-white">
          <DialogTitle className="text-center text-2xl font-medium tracking-tight text-white">
            Dress To Size Guide
          </DialogTitle>
          <DialogClose
            type="button"
            className={cn(
              "absolute top-1/2 right-3 flex size-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md text-white",
              "outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            )}
            aria-label="Close size guide"
          >
            <XIcon className="size-5" weight="bold" />
          </DialogClose>
        </div>
        <div className="mt-8 space-y-2 px-4 py-5 text-base leading-relaxed text-ink">
          <section className="space-y-1">
            <h3 className="text-base sm:text-base md:text-base">Fit details</h3>
            <p className="text-base sm:text-base">
              <span className="font-semibold text-ink">Sized:</span> XS–XL
            </p>
            <p className="text-base sm:text-base">
              The model is wearing a size small and is 5&apos;8.5&quot;.
            </p>
          </section>
          <div className="h-px bg-pink-light" />
          <section>
            <h3 className="text-base font-bold text-ink sm:text-lg">
              Product sizing
            </h3>
            <div className="mt-4 overflow-hidden rounded-2xl">
              <table className="w-full border-collapse text-base">
                <thead>
                  <tr className="bg-muted text-ink">
                    <th className="p-2 text-left text-base font-bold sm:text-base">
                      Brand size
                    </th>
                    <th className="px-4 py-2 text-right text-base font-bold sm:text-base">
                      US
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brandUsRows.map((row, i) => (
                    <tr
                      key={row.brand}
                      className={cn(
                        i % 2 === 1 ? "bg-pink-light" : "bg-white",
                        "border-t border-line first:border-t-0"
                      )}
                    >
                      <td className="px-4 py-2 font-semibold text-ink">
                        {row.brand}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-ink tabular-nums">
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
