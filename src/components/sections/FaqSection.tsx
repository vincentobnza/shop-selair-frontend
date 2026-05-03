import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    q: "How do event rentals work?",
    a: "Pick your piece, choose your rental window (start and return dates), and check out. We ship so it arrives before your event, and you send it back in the prepaid packaging by the return date. Dry cleaning is included in your rental.",
  },
  {
    q: "What if my event rental doesn't fit?",
    a: "First, try the free backup size if your order included one. If it still isn’t right, contact us right away—unused items in original condition may be eligible for an exchange or size swap within the window stated in your order confirmation.",
  },
  {
    q: "Can I purchase my event rental?",
    a: "When a buyout is available for your item, you’ll see the option in your account or on the product page. Pricing depends on the piece and how long you’ve rented; our team can confirm availability if you don’t see a buyout offer.",
  },
  {
    q: "My event rental arrived early. What should I do?",
    a: "That’s normal—we build in buffer so you’re not rushed. Keep the garment in its original packaging until you’re ready to wear it, and follow the same return date in your order. If you have a specific on-site event, you can still return on the scheduled day.",
  },
  {
    q: "How do I make changes to my event rental?",
    a: "For date or address changes, open your order in your account or message us with your order number. Changes are easiest before the order ships; after dispatch, options may be limited and fees can apply.",
  },
  {
    q: "How do I cancel my event rental?",
    a: "Cancel from your account when the option is available, or contact support. Refunds follow our cancellation policy: full or partial credit may apply depending on how close you are to the ship date—see your confirmation email for the exact terms.",
  },
  {
    q: "Can I extend my event rental?",
    a: "Yes, when the item is available. Request an extension before your return due date; we’ll confirm the new end date and any additional rental charge. Late returns without an approved extension may incur late fees.",
  },
  {
    q: "How do free backup sizes work?",
    a: "On eligible styles, we may include a second size at no extra charge so you can try both and send back the one you don’t wear, using the same return kit. Only unworn items in original condition qualify—details are listed at checkout for qualifying products.",
  },
  {
    q: "What happens if I return my event rental late?",
    a: "Returns after the due date may be charged a late fee per day until the item is back in our hands, up to the item’s retail value. If you’re at risk of missing the window, contact us before the due date to ask about an extension.",
  },
  {
    q: "Do I have to send my original rental back in order to receive a replacement?",
    a: "Usually yes—replacements and exchanges are processed once we have the original item back, or you may be asked to return it in the same shipment as the replacement, depending on the situation. Our support team will give you the exact steps for your case.",
  },
] as const

export function FaqSection() {
  return (
    <section className="bg-zinc-50" id="faq" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className="text-center font-heading text-2xl text-zinc-900 sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-600 sm:text-base">
          Event rentals, fit, changes, and returns—quick answers below.
        </p>

        <Accordion
          type="single"
          collapsible
          className="mt-10 w-full"
        >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium text-zinc-900 hover:no-underline sm:py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-zinc-600 leading-relaxed">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
