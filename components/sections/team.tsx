import Image from "next/image";

import { CardGrid } from "@/components/primitives/layouts/card-grid";
import { Carousel } from "@/components/primitives/layouts/carousel";
import { SectionShell } from "@/components/primitives/section-shell";
import type { SectionHeadingProps } from "@/components/sections/section-heading";
import { StaggerItem } from "@/components/shared/motion";
import type { SectionVariantProps } from "@/lib/design/variants";

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio?: string;
};

/** "grid" (default) or "carousel". */
export type TeamLayout = "grid" | "carousel";

export type TeamProps = SectionVariantProps & {
  heading: Omit<SectionHeadingProps, "className">;
  members: TeamMember[];
  layout?: TeamLayout;
};

/** Avatar + name/role/bio — shared across layouts. */
function MemberContent({ member }: { member: TeamMember }) {
  return (
    <>
      <div className="bg-muted relative size-32 overflow-hidden rounded-full">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill sizes="128px" className="object-cover" />
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
    </>
  );
}

/**
 * Team grid. Reused across industries: barbers, stylists, tattoo artists, med
 * spa providers, contractors — the team capability (M10) feeds this section
 * from the database. The grid default is pixel-equivalent; carousel is opt-in.
 *
 * @example
 *   <Team heading={{ title: "Meet the team" }} members={members} />
 */
export function Team({
  heading,
  members,
  layout = "grid",
  surface,
  density,
  background,
  backgroundImage,
}: TeamProps) {
  return (
    <SectionShell
      heading={heading}
      containerClassName="flex flex-col gap-12"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      {layout === "carousel" ? (
        <Carousel label={heading.title} itemWidth="sm">
          {members.map((member) => (
            <div key={member.name} className="flex flex-col items-center gap-3 text-center">
              <MemberContent member={member} />
            </div>
          ))}
        </Carousel>
      ) : (
        <CardGrid base={2} sm={3} lg={4} gap="lg">
          {members.map((member) => (
            <StaggerItem key={member.name} className="flex flex-col items-center gap-3 text-center">
              <MemberContent member={member} />
            </StaggerItem>
          ))}
        </CardGrid>
      )}
    </SectionShell>
  );
}
