import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  /** Small context line under the value, e.g. "+4 this week". */
  hint?: string;
  icon?: LucideIcon;
};

export function StatCard({ title, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="text-muted-foreground size-4" aria-hidden="true" /> : null}
      </CardHeader>
      <CardContent>
        <p className="heading text-2xl">{value}</p>
        {hint ? <p className="text-muted-foreground mt-1 text-xs">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
