import { DynamicForm } from "@/components/forms/dynamic-form";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { getFormDef } from "@/config/forms";
import { resolveFormDef, toClientDef } from "@/lib/forms/types";
import { getLocale } from "@/lib/i18n";

/**
 * CMS section wrapper for engine forms. A disabled or unknown slug renders
 * nothing in production (a warning box in dev), matching the section
 * renderer's invalid-block behavior.
 */
export async function FormSection({
  form,
  heading,
}: {
  form: string;
  heading?: { eyebrow?: string; title: string; description?: string; align?: "center" | "left" };
}) {
  const baseDef = getFormDef(form);
  const def = baseDef ? resolveFormDef(baseDef, await getLocale()) : null;
  if (!def) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <Section>
          <Container>
            <p className="text-destructive rounded-md border border-dashed p-6 text-sm">
              Form section: &quot;{form}&quot; is not an enabled form (see config/forms.ts).
            </p>
          </Container>
        </Section>
      );
    }
    return null;
  }

  return (
    <Section>
      <Container className="flex max-w-2xl flex-col gap-10">
        <SectionHeading
          eyebrow={heading?.eyebrow}
          title={heading?.title ?? def.title}
          description={heading?.description ?? def.intro}
          align={heading?.align}
        />
        <DynamicForm def={toClientDef(def)} />
      </Container>
    </Section>
  );
}
