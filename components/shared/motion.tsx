"use client";

import { LazyMotion, m, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { animationVariants, staggerContainer, type AnimationVariant } from "@/lib/animations";
import { activeTheme } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * Animation wrappers. Server components stay server components — wrap the
 * animated part in one of these client boundaries.
 *
 * All wrappers:
 * - trigger once when scrolled into view
 * - render instantly (no animation) for users with reduced motion enabled
 * - use LazyMotion + `m`, so the animation runtime (~25 kB) loads as its
 *   own async chunk instead of shipping in every page's first-load JS.
 *   `strict` throws in dev if a full `motion.*` component sneaks back in.
 */

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/** Theme motion "none" = render static, exactly like reduced motion. */
const themeDisablesMotion = activeTheme.motion.intensity === "none";

type AnimateProps = HTMLMotionProps<"div"> & {
  /** Which entrance animation to use. */
  variant?: AnimationVariant;
  /** Delay in seconds before the animation starts. */
  delay?: number;
};

export function Animate({ variant = "fade-in-up", delay = 0, className, ...props }: AnimateProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || themeDisablesMotion) {
    return <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)} />;
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        className={cn(className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={animationVariants[variant]}
        transition={delay ? { delay } : undefined}
        {...props}
      />
    </LazyMotion>
  );
}

/** Convenience alias for the most common entrance. */
export function FadeIn(props: Omit<AnimateProps, "variant">) {
  return <Animate variant="fade-in-up" {...props} />;
}

type StaggerProps = HTMLMotionProps<"div">;

/**
 * Parent that staggers its <StaggerItem> children as they enter the viewport.
 */
export function Stagger({ className, ...props }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || themeDisablesMotion) {
    return <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)} />;
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        className={cn(className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        {...props}
      />
    </LazyMotion>
  );
}

export function StaggerItem({
  variant = "fade-in-up",
  className,
  ...props
}: HTMLMotionProps<"div"> & { variant?: AnimationVariant }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || themeDisablesMotion) {
    return <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)} />;
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div className={cn(className)} variants={animationVariants[variant]} {...props} />
    </LazyMotion>
  );
}
