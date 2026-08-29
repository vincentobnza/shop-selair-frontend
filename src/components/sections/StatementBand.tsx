import { STATEMENT_LINE } from "@/dummy/sampleData"

/**
 * The wide positioning line that sits between the hero and the editorial
 * tiles — left-aligned, set large, on the paper ground.
 */
export function StatementBand() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <p className="max-w-4xl font-heading text-2xl leading-snug text-ink sm:text-3xl lg:text-4xl">
          {STATEMENT_LINE}
        </p>
      </div>
    </section>
  )
}

export default StatementBand
