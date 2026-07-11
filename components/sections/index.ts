/**
 * Marketing section components. Pages compose these with typed content:
 *
 *   <Hero title="..." actions={[...]} />
 *   <Features heading={{ title: "..." }} features={[...]} />
 */

export { Hero, type HeroProps, type HeroAction } from "@/components/sections/hero";
export { Features, type FeaturesProps, type Feature } from "@/components/sections/features";
export {
  Testimonials,
  type TestimonialsProps,
  type Testimonial,
} from "@/components/sections/testimonials";
export { Pricing, type PricingProps, type PricingTier } from "@/components/sections/pricing";
export { Faq, type FaqProps, type FaqItem } from "@/components/sections/faq";
export { Cta, type CtaProps } from "@/components/sections/cta";
export { Logos, type LogosProps, type Logo } from "@/components/sections/logos";
export { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
export { Stats, type StatsProps, type Stat } from "@/components/sections/stats";
export { Team, type TeamProps, type TeamMember } from "@/components/sections/team";
export { Timeline, type TimelineProps, type TimelineStep } from "@/components/sections/timeline";
export {
  BeforeAfter,
  type BeforeAfterProps,
  type BeforeAfterItem,
} from "@/components/sections/before-after";
export { Gallery, type GalleryProps, type GalleryImage } from "@/components/sections/gallery";
export { Contact, type ContactProps } from "@/components/sections/contact";
