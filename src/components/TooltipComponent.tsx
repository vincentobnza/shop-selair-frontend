import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
export function TooltipComponent({
  children,
  content,
  side = "bottom",
}: {
  children: React.ReactNode
  content: string
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent
        side={side}
        className="rounded-none! py-3! text-base font-bold text-white"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
