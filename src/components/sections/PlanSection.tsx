import { Link } from "react-router-dom"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { PLAN_DETAILS, PLAN_HIGHLIGHTS, PRIMARY_CONTACT } from "@/config/brand"

/**
 * "How it works" module: eyebrow, headline, a three-cell figure bar, the plan
 * detail accordion, then the primary call to action — the plan + pricing block
 * from the reference screens.
 */
export function PlanSection() {
  return (
    <section id="how-it-works" className="bg-paper">
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="eyebrow">How it works</p>{" "}
        <h2 className="mt-3 font-heading text-2xl font-medium text-ink sm:text-3xl">
          Rented for the date, styled for the occasion
        </h2>
        <p className="mt-2 text-base text-ink-soft">
          Reserve the piece, come in for a fitting, wear it, send it back.
        </p>
        <dl className="mx-auto mt-8 flex max-w-md divide-x divide-white overflow-hidden rounded-sm bg-pink-light">
          {PLAN_HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex-1 px-3 py-4">
              <dt className="sr-only">{h.label}</dt>
              <dd>
                <span className="block font-heading text-3xl leading-none text-ink">
                  {h.value}
                </span>
                <span className="mt-2 block text-base font-semibold text-ink-soft">
                  {h.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <Accordion type="single" collapsible className="mt-10 w-full text-left">
          {PLAN_DETAILS.map((item, i) => (
            <AccordionItem key={item.q} value={`plan-${i}`}>
              <AccordionTrigger className="py-3.5 text-base font-semibold text-ink hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-base leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-8 text-base text-ink-soft">
          Rental rates vary by piece and by how long you need it. Rates and
          fitting slots are confirmed when you book.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            variant="pill"
            asChild
            className="h-11 px-10 text-base font-semibold"
          >
            <Link to="/shop">Browse Pieces</Link>
          </Button>
          <a
            href={PRIMARY_CONTACT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-brand underline-offset-4 hover:underline"
          >
            {PRIMARY_CONTACT.label}
          </a>
        </div>
      </div>
    </section>
  )
}

export default PlanSection
