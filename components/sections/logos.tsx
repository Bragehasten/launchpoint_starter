import Image from "next/image";

import { SectionShell } from "@/components/primitives/section-shell";
import { FadeIn } from "@/components/shared/motion";
import type { SectionVariantProps } from "@/lib/design/variants";

export type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type LogosProps = SectionVariantProps & {
  /** e.g. "Trusted by teams at" */
  label?: string;
  logos: Logo[];
};

/** Social-proof logo strip. Logos render grayscale and regain color on hover. */
export function Logos({ label, logos, surface, density, background, backgroundImage }: LogosProps) {
  return (
    <SectionShell
      className="py-10 sm:py-12 lg:py-14"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      <FadeIn className="flex flex-col items-center gap-8">
        {label ? (
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            {label}
          </p>
        ) : null}
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo) => (
            <li key={logo.alt}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width ?? 120}
                height={logo.height ?? 40}
                className="opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 dark:invert"
              />
            </li>
          ))}
        </ul>
      </FadeIn>
    </SectionShell>
  );
}
