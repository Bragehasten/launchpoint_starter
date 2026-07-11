import Image from "next/image";

import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio?: string;
};

export type TeamProps = {
  heading: Omit<SectionHeadingProps, "className">;
  members: TeamMember[];
};

/**
 * Team grid. Reused across industries: barbers, stylists, tattoo artists,
 * med spa providers, contractors — the team capability (M10) feeds this
 * section from the database.
 */
export function Team({ heading, members }: TeamProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading {...heading} />
        <Stagger className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <StaggerItem key={member.name} className="flex flex-col items-center gap-3 text-center">
              <div className="bg-muted relative size-32 overflow-hidden rounded-full">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground flex h-full items-center justify-center text-3xl font-semibold"
                  >
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
              {member.bio ? (
                <p className="text-muted-foreground text-sm text-balance">{member.bio}</p>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
