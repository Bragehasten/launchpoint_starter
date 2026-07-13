import { StatItem } from "@/components/primitives/stat-item";
import { cn } from "@/lib/utils";

/**
 * A horizontal row of trust signals (stats/metrics), typically placed under a
 * hero's actions. Renders nothing when empty, so an optional collection never
 * leaves a gap. Tokens only.
 *
 * @example
 *   <TrustStrip stats={[{ value: "4.9★", label: "1,200 reviews" }]} />
 */
type TrustStripProps = {
  stats: { value: string; label: string }[];
  className?: string;
};

export function TrustStrip({ stats, className }: TrustStripProps) {
  if (stats.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-x-8 gap-y-4", className)}>
      {stats.map((stat) => (
        <StatItem key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}
