"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { activeThemeName } from "@/config/theme";
import { themes, type ThemeName } from "@/themes";

/**
 * Dev-only wrapper that live-switches theme (data-theme) and colour mode over
 * the whole section catalog, so every example can be QA'd in any theme + mode.
 * The catalog itself is server-rendered and passed as children.
 */
export function CatalogThemer({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(activeThemeName);
  const { setTheme: setColorMode, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      document.documentElement.dataset.theme = activeThemeName;
    };
  }, [theme]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-card sticky top-2 z-30 flex flex-col gap-3 rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground w-24 shrink-0 text-xs font-medium tracking-wide uppercase">
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground w-24 shrink-0 text-xs font-medium tracking-wide uppercase">
            colour mode
          </span>
          {(["light", "dark"] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={mounted && resolvedTheme === mode ? "default" : "outline"}
              onClick={() => setColorMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
