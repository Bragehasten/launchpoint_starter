import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqJsonLd, JsonLd } from "@/lib/seo";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqProps = {
  heading: Omit<SectionHeadingProps, "className">;
  items: FaqItem[];
};

export function Faq({ heading, items }: FaqProps) {
  return (
    <Section>
      {/* FAQ structured data ships automatically with the section. */}
      <JsonLd data={faqJsonLd(items)} />
      <Container className="flex max-w-3xl flex-col gap-12">
        <SectionHeading {...heading} />
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
      </Container>
    </Section>
  );
}
