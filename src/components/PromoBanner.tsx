import { Link } from "react-router-dom"

export function PromoBanner() {
    return (
        <div
            role="region"
            aria-label="Promotion"
            className="fixed top-0 z-60 flex h-12 w-full items-center justify-center gap-2 bg-black px-4 text-center text-xs text-white sm:text-sm"
        >
            <span className="truncate ">
                Event season — browse rentals & dresses for sale. 👜
            </span>
            <Link
                to="/shop"
                className="shrink-0 underline underline-offset-2 hover:text-zinc-300"
            >
                Shop now
            </Link>
        </div>
    )
}
