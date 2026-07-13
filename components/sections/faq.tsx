import { SectionShell } from "@/components/primitives/section-shell";
import { type SectionHeadingProps } from "@/components/sections/section-heading";
import { FadeIn } from "@/components/shared/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SectionVariantProps } from "@/lib/design/variants";
import { faqJsonLd, JsonLd } from "@/lib/seo";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqProps = SectionVariantProps & {
  heading: Omit<SectionHeadingProps, "className">;
  items: FaqItem[];
};

export function Faq({ heading, items, surface, density, background, backgroundImage }: FaqProps) {
  return (
    <SectionShell
      heading={heading}
      containerClassName="flex max-w-3xl flex-col gap-12"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      {/* FAQ structured data ships automatically with the section. */}
      <JsonLd data={faqJsonLd(items)} />
      <FadeIn>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </SectionShell>
  );
}
