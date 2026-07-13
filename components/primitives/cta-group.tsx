import { LocalLink as Link } from "@/components/shared/local-link";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Align } from "@/lib/design/variants";
import { cn } from "@/lib/utils";

/**
 * A row (or stack) of call-to-action buttons. Renders `Button asChild` +
 * `LocalLink` so links stay locale-aware and semantics stay correct. Caps at
 * three actions. `defaultVariant` sets the fallback button style (Hero uses
 * "default", Cta uses "secondary"). Reproduces the current actions markup.
 *
 * @example
 *   <CtaGroup actions={actions} align="center" defaultVariant="secondary" />
 */
export type CtaAction = {
  label: string;
  href: string;
  variant?: ButtonProps["variant"];
};

type CtaGroupProps = {
  actions: CtaAction[];
  strategy?: "inline" | "stacked";
  align?: Align;
  /** Fallback variant for actions that don't specify one. */
  defaultVariant?: ButtonProps["variant"];
  className?: string;
};

export function CtaGroup({
  actions,
  strategy = "inline",
  align = "start",
  defaultVariant = "default",
  className,
}: CtaGroupProps) {
  const items = actions.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        strategy === "stacked" && "flex-col",
        align === "center" && "justify-center",
        className,
      )}
    >
      {items.map((action) => (
        <Button key={action.href} asChild size="lg" variant={action.variant ?? defaultVariant}>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ))}
    </div>
  );
}
