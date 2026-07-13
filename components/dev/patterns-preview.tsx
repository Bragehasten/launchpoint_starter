"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { activeThemeName } from "@/config/theme";
import { themes, type ThemeName } from "@/themes";

/**
 * Dev-only side-by-side of two pattern-assembled pages (barbershop vs roofer),
 * proving that the same theme yields meaningfully different pages purely from
 * pattern/rhythm data. Server-renders both via the real CMS path and toggles
 * here; also live-switches theme like the other /dev previews.
 */
export function PatternsPreview({
  pages,
}: {
  pages: { key: string; label: string; rhythm: string; node: ReactNode }[];
}) {
  const [active, setActive] = useState(pages[0]?.key ?? "");
  const [theme, setTheme] = useState<ThemeName>(activeThemeName);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      document.documentElement.dataset.theme = activeThemeName;
    };
  }, [theme]);

  const current = pages.find((p) => p.key === active) ?? pages[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card sticky top-2 z-20 flex flex-col gap-3 rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground w-20 shrink-0 text-xs font-medium tracking-wide uppercase">
            page
          </span>
          {pages.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant={current?.key === p.key ? "default" : "outline"}
              onClick={() => setActive(p.key)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground w-20 shrink-0 text-xs font-medium tracking-wide uppercase">
            theme
          </span>
          {(Object.keys(themes) as ThemeName[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={theme === name ? "default" : "outline"}
              onClick={() => setTheme(name)}
            >
              {themes[name].label}
            </Button>
          ))}
        </div>
        {current ? (
          <p className="text-muted-foreground text-xs">
            Rhythm: <span className="font-medium">{current.rhythm}</span> — assembled purely from
            patterns.
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border">{current?.node}</div>
    </div>
  );
}
