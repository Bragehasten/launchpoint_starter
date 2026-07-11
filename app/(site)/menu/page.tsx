import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Cta } from "@/components/sections";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { getCapability } from "@/lib/capabilities";
import { formatServicePrice, getServiceGroups } from "@/lib/capabilities/queries";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("services");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Menu", path: "/menu" });
}

/**
 * Services/menu capability route. One component serves restaurants
 * ("menu") and service businesses ("price-list") via presentation config.
 */
export default async function MenuPage() {
  const capability = getCapability("services");
  if (!capability.enabled) notFound();

  const groups = await getServiceGroups();
  const showPrices = capability.showPrices !== false;
  const isMenu = capability.presentation === "menu";

  return (
    <>
      <Section>
        <Container className="flex max-w-3xl flex-col gap-12">
          <SectionHeading
            eyebrow={capability.label}
            title={capability.label ?? "Our Services"}
            description={
              groups.length === 0
                ? "Add groups and items in Admin → Services to fill this page."
                : undefined
            }
          />
          {groups.map((group) => (
            <FadeIn key={group.id} className="flex flex-col gap-4">
              <div className={cn(isMenu && "text-center")}>
                <h2 className="text-2xl font-semibold tracking-tight">{group.name}</h2>
                {group.description ? (
                  <p className="text-muted-foreground mt-1 text-sm">{group.description}</p>
                ) : null}
              </div>
              <ul className="flex flex-col gap-4">
                {group.services.map((service) => (
                  <li key={service.id} className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium">{service.name}</h3>
                      {service.description ? (
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      ) : null}
                    </div>
                    {showPrices ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="border-border mx-1 hidden flex-1 border-b border-dotted sm:block"
                        />
                        <span className="shrink-0 font-medium tabular-nums">
                          {formatServicePrice(service)}
                        </span>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </Container>
      </Section>
      <Cta
        title={isMenu ? "Hungry yet?" : "Ready to book?"}
        actions={[{ label: "Contact us", href: "/contact" }]}
      />
    </>
  );
}
