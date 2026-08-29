import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PRIMARY_CONTACT } from "@/config/brand"

/**
 * Rental FAQ. Answers describe how the service works without committing to
 * figures (rates, deposits, fees) that are confirmed per booking — those are
 * quoted by the shop, not by the site.
 */
const FAQ_ITEMS = [
  {
    q: "How does renting from Sselair work?",
    a: "Pick your piece, choose the dates you need it, and check out. We hold the item for that window, get it to you before your event, and you send it back on your return date.",
  },
  {
    q: "Can I try the piece on before my event?",
    a: "Yes — book a fitting and we will pin and adjust beforehand. If you are outside Metro Manila, message us your measurements and we will advise on the closest fit and what can be adjusted.",
  },
  {
    q: "What if the fit is not right when it arrives?",
    a: "Tell us as soon as it arrives. Depending on the piece and how much time is left before your date, we can look at a size swap, a light alteration, or an alternative from the same collection.",
  },
  {
    q: "Do you rent Barong Tagalog and kids' pieces too?",
    a: "We do. Barong in piña, jusi and organza for grooms, ninongs and guests, and formal pieces cut for children — so one occasion can be dressed from a single booking.",
  },
  {
    q: "Are accessories included?",
    a: "Pearls, brooches and boleros are booked as their own items and can be added to the same reservation so everything arrives together.",
  },
  {
    q: "Do I need to have the piece cleaned before returning it?",
    a: "No. Send it back as it was worn — professional cleaning is handled on our side and is part of the rental.",
  },
  {
    q: "What happens if something is damaged?",
    a: "Normal wear from an event is expected and covered. Tell us straight away if something more serious happens; significant damage may carry a repair charge, and we will always confirm it with you first.",
  },
  {
    q: "Can I extend my rental?",
    a: "Often, yes — it depends on whether the piece is already reserved after your window. Ask before your return date so we can check the calendar and confirm the new end date.",
  },
  {
    q: "What if I return late?",
    a: "A late return can leave the next customer without a piece for their own event, so late returns may carry a fee. If your plans shift, message us before the due date and we will work it out.",
  },
  {
    q: "How do I change or cancel a booking?",
    a: "Open the order in your account, or message us with your order number. Changes are easiest well before your start date; closer in, options are more limited.",
  },
] as const

export function FaqSection() {
  return (
    <section className="bg-pink-light" id="faq" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">Support</p>
        <h2
          id="faq-heading"
          className="mt-3 text-center font-heading text-2xl font-medium text-ink sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-base text-ink-soft">
          Bookings, fittings, returns and everything in between.
        </p>
        <Accordion type="single" collapsible className="mt-10 w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="py-4 text-left text-base font-semibold text-ink hover:no-underline">
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
        <p className="mt-10 text-center text-base text-ink-soft">
          Still deciding?{" "}
          <a
            href={PRIMARY_CONTACT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            {PRIMARY_CONTACT.label}
          </a>
          .
        </p>
      </div>
    </section>
  )
}
