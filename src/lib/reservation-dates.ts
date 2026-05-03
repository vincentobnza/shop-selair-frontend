import { isValid, parseISO, format } from "date-fns"

export function formatReservationDate(iso: string): string {
  try {
    const d = parseISO(iso)
    if (!isValid(d)) return iso
    return format(d, "MM/dd/yyyy")
  } catch {
    return iso
  }
}
