import Image from "next/image";

import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
};

export type TestimonialsProps = {
  heading: Omit<SectionHeadingProps, "className">;
  testimonials: Testimonial[];
};

export function Testimonials({ heading, testimonials }: TestimonialsProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading {...heading} />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <blockquote className="text-sm leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </CardContent>
                <CardFooter className="gap-3">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full text-xs font-medium"
                    >
                      {testimonial.author.charAt(0)}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-medium">{testimonial.author}</p>
                    {testimonial.role ? (
                      <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    ) : null}
                  </div>
                </CardFooter>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
