import type { SectionType } from "@/lib/sections/schemas";

/**
 * Design Engine content data (spec §24, §29 addendum): named section presets
 * and page rhythms. Pure data — no components, no logic. Patterns are pre-filled
 * blocks the wizard/CMS/AI can drop in and edit; rhythms are annotated section
 * sequences per industry archetype that guide assembly. Both are validated by
 * the section schemas exactly like human CMS input.
 */

/** A pre-filled, schema-valid section block. */
export type SectionBlockData = { type: SectionType } & Record<string, unknown>;

/** A named section preset. */
export type SectionPattern = {
  name: string;
  /** Freeform industry archetypes this reads well for. */
  industryHint: string[];
  description: string;
  block: SectionBlockData;
};

/** One step in a page rhythm — a section slot with intent and a suggested pattern. */
export type RhythmStep = {
  type: SectionType;
  /** Why this section earns its place in the sequence. */
  intent: string;
  /** Suggested sectionPattern name to fill the slot. */
  patternHint?: string;
};

/** A named, annotated page composition per industry archetype. */
export type PageRhythm = {
  name: string;
  industries: string[];
  description: string;
  sequence: RhythmStep[];
};

// Neutral placeholder for image-bearing presets (templates; real media is
// supplied on edit). Data-URI so a pattern always renders.
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='800'%20height='600'%3E%3Crect%20width='800'%20height='600'%20fill='%23d4d4d4'/%3E%3C/svg%3E";

export const sectionPatterns: SectionPattern[] = [
  {
    name: "hero-centered",
    industryHint: ["all"],
    description: "Centered hero with two actions — the default landing opener.",
    block: {
      type: "hero",
      layout: "centered",
      align: "center",
      title: "A headline that names the outcome",
      description: "One clear sentence on who this is for and what they get.",
      actions: [
        { label: "Get started", href: "/contact" },
        { label: "See work", href: "/gallery", variant: "outline" },
      ],
    },
  },
  {
    name: "hero-split-media",
    industryHint: ["trades", "wellness", "professional"],
    description: "Split hero with a supporting image on a muted surface.",
    block: {
      type: "hero",
      layout: "split",
      surface: "muted",
      title: "Show the work beside the promise",
      description: "Pair the pitch with a photo of the real thing.",
      actions: [{ label: "Book a call", href: "/contact" }],
      image: { src: PLACEHOLDER, alt: "Representative work" },
    },
  },
  {
    name: "stats-band",
    industryHint: ["trades", "professional", "wellness"],
    description: "Four-up number band for social proof.",
    block: {
      type: "stats",
      surface: "muted",
      stats: [
        { value: "500+", label: "Projects delivered" },
        { value: "4.9★", label: "Average rating" },
        { value: "12 yrs", label: "In business" },
        { value: "48 hr", label: "Quote turnaround" },
      ],
    },
  },
  {
    name: "features-trio",
    industryHint: ["all"],
    description: "Three feature cards — the workhorse value section.",
    block: {
      type: "features",
      columns: 3,
      heading: { title: "What you get", align: "center" },
      features: [
        { title: "Done right", description: "Careful work, no shortcuts, no surprises." },
        { title: "On schedule", description: "We start when we say and finish when we say." },
        { title: "Fairly priced", description: "Clear quotes up front, no padding." },
      ],
    },
  },
  {
    name: "features-quad-compact",
    industryHint: ["professional", "hospitality"],
    description: "Four compact features for capability-dense businesses.",
    block: {
      type: "features",
      columns: 4,
      density: "compact",
      heading: { title: "Everything under one roof", align: "center" },
      features: [
        { title: "Consultation", description: "We learn the job before quoting it." },
        { title: "Materials", description: "Only what we'd use on our own place." },
        { title: "Cleanup", description: "You'd never know we were there." },
        { title: "Warranty", description: "Backed in writing." },
      ],
    },
  },
  {
    name: "timeline-process",
    industryHint: ["trades", "professional", "wellness"],
    description: "Numbered how-we-work process.",
    block: {
      type: "timeline",
      heading: { title: "How it works", align: "center" },
      steps: [
        { title: "Reach out", description: "Tell us what you need." },
        { title: "Get a quote", description: "Clear scope and price, fast." },
        { title: "We do the work", description: "On time, on budget." },
        { title: "You approve", description: "Not done until you're happy." },
      ],
    },
  },
  {
    name: "gallery-grid",
    industryHint: ["trades", "hospitality", "grooming", "events"],
    description: "Three-column image grid of recent work.",
    block: {
      type: "gallery",
      columns: 3,
      heading: { title: "Recent work", align: "center" },
      images: Array.from({ length: 6 }, (_, i) => ({
        src: `${PLACEHOLDER}#${i}`,
        alt: `Recent work ${i + 1}`,
      })),
    },
  },
  {
    name: "before-after-pair",
    industryHint: ["trades", "wellness", "grooming"],
    description: "Two before/after comparisons.",
    block: {
      type: "before-after",
      heading: { title: "See the difference", align: "center" },
      items: [
        {
          before: `${PLACEHOLDER}#b1`,
          after: `${PLACEHOLDER}#a1`,
          alt: "Job one",
          caption: "Full redo",
        },
        {
          before: `${PLACEHOLDER}#b2`,
          after: `${PLACEHOLDER}#a2`,
          alt: "Job two",
          caption: "Refresh",
        },
      ],
    },
  },
  {
    name: "team-grid",
    industryHint: ["grooming", "wellness", "professional"],
    description: "Team headshots grid.",
    block: {
      type: "team",
      heading: { title: "Meet the team", align: "center" },
      members: [
        { name: "Casey Kim", role: "Owner" },
        { name: "Devin Park", role: "Senior" },
        { name: "Morgan Diaz", role: "Specialist" },
        { name: "Riley Fox", role: "Apprentice" },
      ],
    },
  },
  {
    name: "testimonials-grid",
    industryHint: ["all"],
    description: "Three quote cards.",
    block: {
      type: "testimonials",
      heading: { title: "What people say", align: "center" },
      testimonials: [
        {
          quote: "Fast, tidy, and exactly what they quoted.",
          author: "Alex Rivera",
          role: "Homeowner",
        },
        { quote: "Booked Tuesday, done Thursday.", author: "Sam Chen", role: "Local" },
        { quote: "The only crew we call now.", author: "Jordan Lee", role: "Property manager" },
      ],
    },
  },
  {
    name: "testimonials-carousel",
    industryHint: ["hospitality", "grooming", "events"],
    description: "Quote cards in a scrolling carousel.",
    block: {
      type: "testimonials",
      layout: "carousel",
      surface: "muted",
      heading: { title: "Loved by regulars", align: "center" },
      testimonials: [
        { quote: "Best in town, hands down.", author: "Pat Morgan" },
        { quote: "Worth the drive.", author: "Dana Cole" },
        { quote: "I send everyone here.", author: "Sky Nolan" },
      ],
    },
  },
  {
    name: "pricing-tiers",
    industryHint: ["professional", "grooming", "wellness"],
    description: "Three-tier pricing with a highlighted plan.",
    block: {
      type: "pricing",
      heading: { title: "Simple pricing", align: "center" },
      tiers: [
        {
          name: "Basic",
          price: "$49",
          features: ["Core service", "Email support"],
          cta: { label: "Choose", href: "/contact" },
        },
        {
          name: "Standard",
          price: "$99",
          highlighted: true,
          features: ["Everything in Basic", "Priority scheduling", "Follow-up"],
          cta: { label: "Choose", href: "/contact" },
        },
        {
          name: "Premium",
          price: "$199",
          features: ["Everything in Standard", "Dedicated contact"],
          cta: { label: "Choose", href: "/contact" },
        },
      ],
    },
  },
  {
    name: "faq-basics",
    industryHint: ["all"],
    description: "Common questions accordion.",
    block: {
      type: "faq",
      heading: { title: "Questions, answered", align: "center" },
      items: [
        { question: "How soon can you start?", answer: "Usually within the week." },
        { question: "Do you give quotes?", answer: "Free and in writing, every time." },
        { question: "Are you insured?", answer: "Fully licensed and insured." },
      ],
    },
  },
  {
    name: "logos-strip",
    industryHint: ["professional", "hospitality"],
    description: "Trust logo strip.",
    block: {
      type: "logos",
      label: "Trusted by teams at",
      logos: Array.from({ length: 5 }, (_, i) => ({
        src: `${PLACEHOLDER}#logo${i}`,
        alt: `Partner ${i + 1}`,
        width: 120,
        height: 40,
      })),
    },
  },
  {
    name: "cta-banner",
    industryHint: ["all"],
    description: "Closing call-to-action banner.",
    block: {
      type: "cta",
      title: "Ready when you are",
      description: "Tell us about the job and we'll get you a quote.",
      actions: [{ label: "Get a quote", href: "/contact" }],
    },
  },
];

export const pageRhythms: PageRhythm[] = [
  {
    name: "trades-landing",
    industries: ["roofer", "contractor", "landscaper", "plumber"],
    description: "Proof-led sequence for trades: numbers, process, and before/after.",
    sequence: [
      { type: "hero", intent: "Name the outcome", patternHint: "hero-split-media" },
      { type: "stats", intent: "Credibility by the numbers", patternHint: "stats-band" },
      { type: "features", intent: "What sets the work apart", patternHint: "features-trio" },
      { type: "timeline", intent: "Make the process feel easy", patternHint: "timeline-process" },
      { type: "before-after", intent: "Show the transformation", patternHint: "before-after-pair" },
      { type: "testimonials", intent: "Neighbors vouch", patternHint: "testimonials-grid" },
      { type: "faq", intent: "Handle objections", patternHint: "faq-basics" },
      { type: "cta", intent: "Ask for the quote", patternHint: "cta-banner" },
    ],
  },
  {
    name: "hospitality-landing",
    industries: ["restaurant", "cafe", "bar"],
    description: "Appetite-first sequence: mood, menu, and social proof.",
    sequence: [
      { type: "hero", intent: "Set the mood", patternHint: "hero-centered" },
      {
        type: "features",
        intent: "Highlights of the offering",
        patternHint: "features-quad-compact",
      },
      { type: "gallery", intent: "Make them hungry", patternHint: "gallery-grid" },
      { type: "testimonials", intent: "Regulars approve", patternHint: "testimonials-carousel" },
      { type: "cta", intent: "Reserve or visit", patternHint: "cta-banner" },
    ],
  },
  {
    name: "grooming-landing",
    industries: ["barbershop", "salon", "tattoo"],
    description: "People-first sequence: team, work, and easy booking.",
    sequence: [
      { type: "hero", intent: "Name the vibe", patternHint: "hero-centered" },
      { type: "features", intent: "Services at a glance", patternHint: "features-trio" },
      { type: "team", intent: "Meet who you'll sit with", patternHint: "team-grid" },
      { type: "gallery", intent: "Show the results", patternHint: "gallery-grid" },
      { type: "testimonials", intent: "Regulars rave", patternHint: "testimonials-carousel" },
      { type: "cta", intent: "Book the chair", patternHint: "cta-banner" },
    ],
  },
  {
    name: "wellness-landing",
    industries: ["med-spa", "spa", "clinic", "dental"],
    description: "Trust-first sequence: expertise, care, and reassurance.",
    sequence: [
      { type: "hero", intent: "Lead with calm", patternHint: "hero-split-media" },
      { type: "features", intent: "The care you get", patternHint: "features-trio" },
      { type: "team", intent: "Meet your providers", patternHint: "team-grid" },
      { type: "testimonials", intent: "Patients trust", patternHint: "testimonials-grid" },
      { type: "pricing", intent: "Transparent treatment pricing", patternHint: "pricing-tiers" },
      { type: "faq", intent: "Ease the nerves", patternHint: "faq-basics" },
      { type: "cta", intent: "Book a consult", patternHint: "cta-banner" },
    ],
  },
  {
    name: "professional-landing",
    industries: ["agency", "consultant", "law", "accounting"],
    description: "Authority-first sequence: logos, results, and clear pricing.",
    sequence: [
      { type: "hero", intent: "State the value", patternHint: "hero-centered" },
      { type: "logos", intent: "Borrow trust", patternHint: "logos-strip" },
      { type: "features", intent: "How you help", patternHint: "features-quad-compact" },
      { type: "stats", intent: "Results in numbers", patternHint: "stats-band" },
      { type: "testimonials", intent: "Clients endorse", patternHint: "testimonials-grid" },
      { type: "pricing", intent: "Packages", patternHint: "pricing-tiers" },
      { type: "cta", intent: "Start a conversation", patternHint: "cta-banner" },
    ],
  },
  {
    name: "events-landing",
    industries: ["venue", "planner", "photographer"],
    description: "Vision-first sequence: portfolio, process, and inquiry.",
    sequence: [
      { type: "hero", intent: "Sell the feeling", patternHint: "hero-split-media" },
      { type: "gallery", intent: "Show the portfolio", patternHint: "gallery-grid" },
      { type: "features", intent: "What's included", patternHint: "features-trio" },
      { type: "timeline", intent: "How planning goes", patternHint: "timeline-process" },
      {
        type: "testimonials",
        intent: "Couples/clients rave",
        patternHint: "testimonials-carousel",
      },
      { type: "cta", intent: "Check a date", patternHint: "cta-banner" },
    ],
  },
];

/** Look up a section pattern by name. */
export function getSectionPattern(name: string): SectionPattern | undefined {
  return sectionPatterns.find((p) => p.name === name);
}

/** Look up a page rhythm by name. */
export function getPageRhythm(name: string): PageRhythm | undefined {
  return pageRhythms.find((r) => r.name === name);
}
