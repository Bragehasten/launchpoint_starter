"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  alt: string;
  className?: string;
};

/**
 * Before/after comparison driven by a native range input — keyboard and
 * screen-reader accessible for free, no drag-handler code to maintain.
 */
export function BeforeAfterSlider({ before, after, alt, className }: BeforeAfterSliderProps) {
  const [position, setPosition] = React.useState(50);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-xl border select-none",
        className,
      )}
    >
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="bg-background absolute top-0 bottom-0 w-0.5"
        style={{ left: `${position}%` }}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`Compare before and after: ${alt}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
      <span className="bg-background/80 absolute top-3 left-3 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
        Before
      </span>
      <span className="bg-background/80 absolute top-3 right-3 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
        After
      </span>
    </div>
  );
}
