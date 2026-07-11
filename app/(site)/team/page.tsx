import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Cta, Team } from "@/components/sections";
import { getCapability } from "@/lib/capabilities";
import { getTeamMembers } from "@/lib/capabilities/queries";
import { createMetadata } from "@/lib/seo";

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

  return (
    <>
      <Team
        heading={{
          eyebrow: capability.label ?? "Our Team",
          title: capability.label ?? "Meet the team",
          description:
            members.length === 0
              ? "Add team members in Admin → Team to fill this page."
              : undefined,
        }}
        members={members.map((member) => ({
          name: member.name,
          role: member.role,
          image: member.image ?? undefined,
          bio: member.bio ?? undefined,
        }))}
      />
      <Cta title="Ready to book?" actions={[{ label: "Get in touch", href: "/contact" }]} />
    </>
  );
}
