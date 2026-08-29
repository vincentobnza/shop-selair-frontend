"use client"
import { format } from "date-fns"
import { CalendarDotsIcon } from "@phosphor-icons/react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMemo } from "react"
import { useReservationsByProduct } from "@/features/reservations/queries"
export function ReservationCalendar({
  range,
  setRange,
  productId,
}: {
  range: DateRange | undefined
  setRange: (range: DateRange | undefined) => void
  productId?: string | number
}) {
  const { data: reservations = [] } = useReservationsByProduct(
    productId ? String(productId) : undefined
  )

  const disabled = useMemo(() => {
    return reservations.map((r) => ({
      from: new Date(r.rentalStart),
      to: new Date(r.rentalEnd),
    }))
  }, [reservations])
  const now = new Date()
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endMonth = new Date(now.getFullYear() + 2, 11, 1)

  const label = (() => {
    if (range?.from && range?.to) {
      return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`
    }

    if (range?.from) {
      return `${format(range.from, "PPP")} - Select return date`
    }

    return "Select rental dates"
  })()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          data-empty={!range?.from}
          className="h-12! w-full justify-between rounded-sm! border-line text-left text-base font-medium data-[empty=true]:text-muted-foreground md:text-base!"
        >
          <span>{label}</span>
          <CalendarDotsIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] p-0 sm:w-auto"
        align="center"
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={range?.from}
          numberOfMonths={2}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
