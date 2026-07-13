import type { Metadata } from "next";

import { CatalogThemer } from "@/components/dev/catalog-themer";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { SectionRenderer } from "@/components/shared/section-renderer";
import { Badge } from "@/components/ui/badge";
import { sectionMetaList } from "@/lib/sections/meta";

export const metadata: Metadata = {
  title: "Section catalog",
  robots: { index: false },
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-muted-foreground w-20 shrink-0 uppercase">{label}</span>
      <span>{value}</span>
    </div>
  );
}

/**
 * Dev-only, catalog-driven section gallery (Milestone D). Rendered entirely
 * from lib/sections/meta.ts: every registered section, its metadata, and its
 * examples rendered live through the validated CMS path. Each example is also a
 * fixture for tests/sections.spec.ts. `noindex` (like /dev/themes) but
 * reachable in production so the smoke suite can walk it against `next start`.
 *
 * Catalog labels are plain text (not headings), so the only document headings
 * come from the rendered examples themselves — keeping heading order honest.
 */
export default function SectionsPage() {
  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Dev"
          title="Section catalog"
          description="Every registered section, straight from the meta catalog. Examples render through the same validated path as real CMS blocks."
        />
        <CatalogThemer>
          {sectionMetaList.map((meta) => (
            <section
              key={meta.type}
              data-section={meta.type}
              className="overflow-hidden rounded-lg border"
            >
              <div className="bg-muted/40 flex flex-col gap-2 border-b p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{meta.title}</span>
                  <Badge variant="secondary">{meta.status}</Badge>
                  <span className="text-muted-foreground text-xs">since {meta.since}</span>
                </div>
                <p className="text-muted-foreground text-sm">{meta.purpose}</p>
                <div className="flex flex-col gap-1 pt-1">
                  <MetaRow label="primitives" value={meta.primitives.join(", ")} />
                  <MetaRow label="layouts" value={meta.layouts.join(", ")} />
                  <MetaRow label="variants" value={meta.variants.join(", ")} />
                  <MetaRow label="slots" value={meta.slots.join(", ")} />
                </div>
              </div>
              <div className="flex flex-col divide-y">
                {meta.examples.map((example, i) => (
                  <div
                    key={example.label}
                    data-section-example={`${meta.type}.${i}`}
                    className="flex flex-col gap-2 p-4"
                  >
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      {example.label}
                    </span>
                    <div className="bg-background overflow-hidden rounded border">
                      <SectionRenderer blocks={[{ type: meta.type, ...example.props }]} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </CatalogThemer>
      </Container>
    </Section>
  );
}
