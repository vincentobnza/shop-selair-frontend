


import { DotPulse } from "./ui/dot-pulse";

export default function SuspenseLoading() {
    return <div className="fixed z-999 inset-0 bg-white/90 flex items-center justify-center">
        <DotPulse size="lg" />
    </div>;
}
