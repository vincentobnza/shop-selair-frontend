import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
export function TooltipComponent({ children, content, side = "bottom" }: { children: React.ReactNode, content: string, side?: "top" | "right" | "bottom" | "left" }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>

            <TooltipContent side={side} className="text-xs font-bold text-white py-3! rounded-none!">
                {content}
            </TooltipContent>
        </Tooltip>
    )
}