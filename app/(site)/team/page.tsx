import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Cta, Team } from "@/components/sections";
import { getCapability } from "@/lib/capabilities";
import { getTeamMembers } from "@/lib/capabilities/queries";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

const en = {
  title: "Meet the team",
  empty: "Add team members in Admin → Team to fill this page.",
  cta: "Ready to book?",
  action: "Get in touch",
};

const es: typeof en = {
  title: "Conoce al equipo",
  empty: "Agrega miembros del equipo en Admin → Equipo para llenar esta página.",
  cta: "¿Listo para reservar?",
  action: "Ponte en contacto",
};

const pageContent = { en, es };

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("team");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Our Team", path: "/team" });
}

/** Team capability route. 404s when the client's module doesn't enable it. */
export default async function TeamPage() {
  const capability = getCapability("team");
  if (!capability.enabled) notFound();

  const members = await getTeamMembers();

  const locale = await getLocale();
  const t = pageContent[locale];

  return (
    <>
      <Team
        heading={{
          eyebrow: locale === "es" ? undefined : (capability.label ?? "Our Team"),
          title: locale === "es" ? t.title : (capability.label ?? t.title),
          description: members.length === 0 ? t.empty : undefined,
        }}
        members={members.map((member) => ({
          name: member.name,
          role: member.role,
          image: member.image ?? undefined,
          bio: member.bio ?? undefined,
        }))}
      />
      <Cta title={t.cta} actions={[{ label: t.action, href: "/contact" }]} />
    </>
  );
}
