"use client"
import { format } from "date-fns"
import { CalendarDotsIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ReservationCalendar({
  date,
  setDate,
}: {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          data-empty={!date}
          className="h-12! w-full justify-between rounded-none! text-left text-sm font-medium data-[empty=true]:text-muted-foreground md:text-base!"
        >
          {date ? format(date, "PPP") : <span>Reserve a date</span>}
          <CalendarDotsIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-full!" align="center">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
