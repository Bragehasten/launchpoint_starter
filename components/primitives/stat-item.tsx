import { cn } from "@/lib/utils";

/**
 * A single headline metric: a large value over a muted label. Presentational —
 * pass already-resolved strings. Tokens only.
 *
 * @example
 *   <StatItem value="500+" label="Projects delivered" />
 */
type StatItemProps = {
  value: string;
  label: string;
  className?: string;
};

export function StatItem({ value, label, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="heading text-3xl">{value}</span>
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
}
