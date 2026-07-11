/**
 * Framer Motion feature bundle, isolated so LazyMotion can code-split it.
 * `domAnimation` covers everything the framework uses (variants, viewport
 * triggers, hover/tap). If a component ever needs drag or layout
 * animations, switch this export to `domMax` — one line, same split.
 */
export { domAnimation as default } from "framer-motion";
