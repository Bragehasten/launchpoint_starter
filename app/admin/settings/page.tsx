import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

function SettingRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

/**
 * Settings pattern page. Today: read-only view of code-level config.
 * When the CMS lands (M5), editable site settings mount here.
 */
export default async function SettingsPage() {
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Site configuration. Values marked “code” are edited in{" "}
          <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">config/site.ts</code>.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>Who this site belongs to</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <SettingRow label="Site name" value={siteConfig.name} />
            <SettingRow label="Production URL" value={siteConfig.url} />
            <SettingRow label="Locale" value={siteConfig.locale} />
            <SettingRow label="Description" value={siteConfig.description} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Feature flags from config</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {Object.entries(siteConfig.features).map(([flag, enabled]) => (
              <SettingRow
                key={flag}
                label={flag}
                value={
                  <Badge variant={enabled ? "default" : "secondary"}>
                    {enabled ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
