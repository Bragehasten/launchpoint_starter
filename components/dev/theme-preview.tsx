"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activeThemeName } from "@/config/theme";
import { themes, type ThemeName } from "@/themes";

/**
 * Live theme switcher (dev only): sets data-theme on <html> so the CSS
 * token bundles swap in place. Resets to the configured theme on unmount.
 */
export function ThemePreview() {
  const [current, setCurrent] = useState<ThemeName>(activeThemeName);

  useEffect(() => {
    document.documentElement.dataset.theme = current;
    return () => {
      document.documentElement.dataset.theme = activeThemeName;
    };
  }, [current]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(themes) as ThemeName[]).map((name) => (
          <Button
            key={name}
            variant={current === name ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrent(name)}
          >
            {themes[name].label}
          </Button>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">{themes[current].description}</p>

      <div className="flex flex-col gap-4">
        <h1 className="heading text-4xl sm:text-5xl">Display heading</h1>
        <h2 className="heading text-3xl">Section heading</h2>
        <p className="text-muted-foreground max-w-prose">
          Body copy stays in the sans stack while headings, radius, shadows, spacing, and color
          shift with the theme. Every component below is the real one used across the site.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Badge>Badge</Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="heading">Card title</CardTitle>
            <CardDescription>Elevation comes from the theme&apos;s shadow tokens.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preview-input">Input</Label>
              <Input id="preview-input" placeholder="Radius and ring follow the theme" />
            </div>
            <Button className="w-fit">Submit</Button>
          </CardContent>
        </Card>
        <div className="shadow-elevated bg-card flex items-center justify-center rounded-xl border p-10">
          <span className="text-muted-foreground text-sm">shadow-elevated surface</span>
        </div>
      </div>
    </div>
  );
}
