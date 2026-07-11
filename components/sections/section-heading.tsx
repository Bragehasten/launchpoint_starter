import { FadeIn } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  /** Small badge text above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

/** Shared heading block used by every marketing section — keeps rhythm consistent. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <FadeIn
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <h2 className="heading text-3xl text-balance sm:text-4xl">{title}</h2>
      {description ? (
        <p className="text-muted-foreground text-lg text-balance">{description}</p>
      ) : null}
    </FadeIn>
  );
}
