import type { Variants } from "framer-motion";

import { activeTheme } from "@/config/theme";
import type { MotionCharacter, MotionIntensity } from "@/themes";

/**
 * Shared animation variants. Pure data — safe to import anywhere.
 * Use via the motion wrappers in components/shared/motion.tsx, which
 * handle the client boundary, viewport triggering, and reduced motion.
 *
 * The theme's motion intensity scales everything here: "subtle" is the
 * baseline, "expressive" moves further and lingers longer, and "none"
 * short-circuits in the wrappers (these variants are never mounted). The
 * motion character sets the easing personality: "crisp" is snappy, "smooth"
 * eases out gently, "springy" overshoots.
 */

const INTENSITY: Record<MotionIntensity, { duration: number; distance: number }> = {
  none: { duration: 0, distance: 0 },
  subtle: { duration: 1, distance: 1 },
  expressive: { duration: 1.3, distance: 1.5 },
};

/** Cubic-bezier easing per motion character (framer accepts [x1,y1,x2,y2]). */
const EASING: Record<MotionCharacter, [number, number, number, number]> = {
  crisp: [0.4, 0, 0.2, 1],
  smooth: [0.22, 1, 0.36, 1],
  springy: [0.34, 1.56, 0.64, 1],
};

const scale = INTENSITY[activeTheme.motion.intensity];
const ease = EASING[activeTheme.motion.character];
const duration = 0.5 * scale.duration;
const distance = 16 * scale.distance;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration, ease } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0, transition: { duration, ease } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -distance },
  visible: { opacity: 1, y: 0, transition: { duration, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 * scale.duration, ease },
  },
};

/** Parent container that staggers its children's `visible` transition. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 * scale.duration } },
};

export const animationVariants = {
  "fade-in": fadeIn,
  "fade-in-up": fadeInUp,
  "fade-in-down": fadeInDown,
  "scale-in": scaleIn,
} as const;

export type AnimationVariant = keyof typeof animationVariants;
