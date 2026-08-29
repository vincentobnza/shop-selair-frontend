import { DotPulse } from "./ui/dot-pulse"
export default function SuspenseLoading() {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-white/90">
      <DotPulse size="lg" />
    </div>
  )
}
