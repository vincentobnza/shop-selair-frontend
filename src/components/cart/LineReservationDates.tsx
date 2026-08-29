import { formatReservationDate } from "@/lib/reservation-dates"
import { cn } from "@/lib/utils"

type LineReservationDatesProps = {
  start?: string
  end?: string
  className?: string
}

export function LineReservationDates({
  start,
  end,
  className,
}: LineReservationDatesProps) {
  if (!start || !end) return null

  return (
    <div className={cn("mt-2 text-base", className)}>
      <p>Start: {formatReservationDate(start)}</p>
      <p className="mt-0.5">Finish: {formatReservationDate(end)}</p>
    </div>
  )
}
