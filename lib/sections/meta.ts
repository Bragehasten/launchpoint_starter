import type { SectionType } from "@/lib/sections/schemas";

/**
 * Machine-readable section catalog (spec §13). ONE entry per registry key,
 * asserted complete at dev boot (see registry.tsx). It powers three things at
 * once — the /dev/sections gallery (examples become live previews), the
 * Playwright smoke suite (each example is a fixture), and AI/CMS discovery —
 * so documentation, tests, and tooling can never drift from the code.
 *
 * `examples[].props` are schema-valid section props (minus `type`); rendered as
 * `{ type, ...props }` through the same validated path as real CMS blocks.
 */

export type SectionMeta = {
  type: SectionType;
  title: string;
  purpose: string;
  /** Primitives the section is assembled from. */
  primitives: string[];
  /** Layout strategies it can render (first is the default). */
  layouts: string[];
  /** Variant axes / notable props it understands. */
  variants: string[];
  /** Named content slots. */
  slots: string[];
  since: string;
  status: "stable" | "beta" | "deprecated";
  replacedBy?: SectionType;
  examples: { label: string; props: Record<string, unknown> }[];
};

// Neutral placeholder media for examples (data-URI always renders).
const IMG =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='800'%20height='600'%3E%3Crect%20width='800'%20height='600'%20fill='%23d4d4d4'/%3E%3C/svg%3E";

const BASE_AXES = ["surface", "density", "align", "emphasis", "background"];

export const sectionMeta: Record<SectionType, SectionMeta> = {
  hero: {
    type: "hero",
    title: "Hero",
    purpose: "The page's H1 and primary call to action.",
    primitives: ["SectionShell", "ContentBlock", "CtaGroup", "MediaBlock", "SplitLayout"],
    layouts: ["centered", "split"],
    variants: [...BASE_AXES, "layout"],
    slots: ["eyebrow", "title", "description", "actions", "image"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Centered",
        props: {
          eyebrow: "New",
          title: "Websites that feel expensive, shipped fast",
          description: "One clear sentence on who this is for and what they get.",
          actions: [
            { label: "Get started", href: "/contact" },
            { label: "See work", href: "/gallery", variant: "outline" },
          ],
        },
      },
      {
        label: "Split · muted",
        props: {
          layout: "split",
          surface: "muted",
          title: "Show the work beside the promise",
          description: "Pair the pitch with a photo of the real thing.",
          actions: [{ label: "Book a call", href: "/contact" }],
          image: { src: IMG, alt: "Representative work" },
        },
      },
    ],
  },
  features: {
    type: "features",
    title: "Features",
    purpose: "The core value section — what the customer gets.",
    primitives: ["SectionShell", "CardGrid", "Carousel", "Card"],
    layouts: ["grid", "carousel"],
    variants: [...BASE_AXES, "layout", "columns"],
    slots: ["heading", "features[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Grid · 3",
        props: {
          columns: 3,
          heading: { title: "What you get" },
          features: [
            { title: "Done right", description: "Careful work, no shortcuts." },
            { title: "On schedule", description: "Start when we say, finish when we say." },
            { title: "Fairly priced", description: "Clear quotes up front." },
          ],
        },
      },
      {
        label: "Carousel",
        props: {
          layout: "carousel",
          heading: { title: "Everything under one roof" },
          features: [
            { title: "Consultation", description: "We learn the job first." },
            { title: "Materials", description: "Only what we'd use ourselves." },
            { title: "Warranty", description: "Backed in writing." },
          ],
        },
      },
    ],
  },
  testimonials: {
    type: "testimonials",
    title: "Testimonials",
    purpose: "Social proof in the customer's own words.",
    primitives: ["SectionShell", "CardGrid", "Carousel", "Masonry", "Card"],
    layouts: ["grid", "carousel", "masonry"],
    variants: [...BASE_AXES, "layout"],
    slots: ["heading", "testimonials[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Grid",
        props: {
          heading: { title: "What people say" },
          testimonials: [
            {
              quote: "Fast, tidy, exactly what they quoted.",
              author: "Alex Rivera",
              role: "Homeowner",
            },
            { quote: "Booked Tuesday, done Thursday.", author: "Sam Chen", role: "Local" },
            { quote: "The only crew we call now.", author: "Jordan Lee", role: "Manager" },
          ],
        },
      },
      {
        label: "Carousel · muted",
        props: {
          layout: "carousel",
          surface: "muted",
          heading: { title: "Loved by regulars" },
          testimonials: [
            { quote: "Best in town, hands down.", author: "Pat Morgan" },
            { quote: "Worth the drive.", author: "Dana Cole" },
            { quote: "I send everyone here.", author: "Sky Nolan" },
          ],
        },
      },
    ],
  },
  pricing: {
    type: "pricing",
    title: "Pricing",
    purpose: "Transparent plans or packages with a highlighted option.",
    primitives: ["SectionShell", "CardGrid", "Card"],
    layouts: ["grid"],
    variants: [...BASE_AXES],
    slots: ["heading", "tiers[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Three tiers",
        props: {
          heading: { title: "Simple pricing" },
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
              features: ["Everything in Basic", "Priority scheduling"],
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
    ],
  },
  faq: {
    type: "faq",
    title: "FAQ",
    purpose: "Answer objections; emits FAQPage JSON-LD automatically.",
    primitives: ["SectionShell", "Accordion"],
    layouts: ["stack"],
    variants: [...BASE_AXES],
    slots: ["heading", "items[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Basics",
        props: {
          heading: { title: "Questions, answered" },
          items: [
            { question: "How soon can you start?", answer: "Usually within the week." },
            { question: "Do you give quotes?", answer: "Free and in writing, every time." },
            { question: "Are you insured?", answer: "Fully licensed and insured." },
          ],
        },
      },
    ],
  },
  cta: {
    type: "cta",
    title: "CTA",
    purpose: "Closing call-to-action banner before the footer.",
    primitives: ["SectionShell", "ContentBlock", "CtaGroup"],
    layouts: ["centered"],
    variants: [...BASE_AXES],
    slots: ["title", "description", "actions"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Banner",
        props: {
          title: "Ready when you are",
          description: "Tell us about the job and we'll get you a quote.",
          actions: [{ label: "Get a quote", href: "/contact" }],
        },
      },
    ],
  },
  logos: {
    type: "logos",
    title: "Logos",
    purpose: "Borrow trust with a partner/client logo strip.",
    primitives: ["SectionShell"],
    layouts: ["inline-strip"],
    variants: [...BASE_AXES],
    slots: ["label", "logos[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Strip",
        props: {
          label: "Trusted by teams at",
          logos: Array.from({ length: 5 }, (_, i) => ({
            src: `${IMG}#l${i}`,
            alt: `Partner ${i + 1}`,
            width: 120,
            height: 40,
          })),
        },
      },
    ],
  },
  stats: {
    type: "stats",
    title: "Stats",
    purpose: "Social proof by the numbers.",
    primitives: ["SectionShell", "CardGrid"],
    layouts: ["grid"],
    variants: [...BASE_AXES],
    slots: ["stats[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Band",
        props: {
          surface: "muted",
          stats: [
            { value: "500+", label: "Projects delivered" },
            { value: "4.9★", label: "Average rating" },
            { value: "12 yrs", label: "In business" },
            { value: "48 hr", label: "Quote turnaround" },
          ],
        },
      },
    ],
  },
  team: {
    type: "team",
    title: "Team",
    purpose: "Put faces to the business.",
    primitives: ["SectionShell", "CardGrid", "Carousel"],
    layouts: ["grid", "carousel"],
    variants: [...BASE_AXES, "layout"],
    slots: ["heading", "members[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Grid",
        props: {
          heading: { title: "Meet the team" },
          members: [
            { name: "Casey Kim", role: "Owner" },
            { name: "Devin Park", role: "Senior" },
            { name: "Morgan Diaz", role: "Specialist" },
            { name: "Riley Fox", role: "Apprentice" },
          ],
        },
      },
    ],
  },
  timeline: {
    type: "timeline",
    title: "Timeline",
    purpose: "Make a process feel easy — numbered steps.",
    primitives: ["SectionShell", "Stagger"],
    layouts: ["numbered"],
    variants: [...BASE_AXES],
    slots: ["heading", "steps[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Process",
        props: {
          heading: { title: "How it works" },
          steps: [
            { title: "Reach out", description: "Tell us what you need." },
            { title: "Get a quote", description: "Clear scope and price, fast." },
            { title: "We do the work", description: "On time, on budget." },
            { title: "You approve", description: "Not done until you're happy." },
          ],
        },
      },
    ],
  },
  "before-after": {
    type: "before-after",
    title: "Before / After",
    purpose: "Show a transformation with an interactive slider.",
    primitives: ["SectionShell", "CardGrid", "BeforeAfterSlider"],
    layouts: ["grid"],
    variants: [...BASE_AXES],
    slots: ["heading", "items[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Pair",
        props: {
          heading: { title: "See the difference" },
          items: [
            { before: `${IMG}#b1`, after: `${IMG}#a1`, alt: "Job one", caption: "Full redo" },
            { before: `${IMG}#b2`, after: `${IMG}#a2`, alt: "Job two", caption: "Refresh" },
          ],
        },
      },
    ],
  },
  gallery: {
    type: "gallery",
    title: "Gallery",
    purpose: "A responsive image grid of recent work.",
    primitives: ["SectionShell", "CardGrid", "Carousel"],
    layouts: ["grid", "carousel"],
    variants: [...BASE_AXES, "layout", "columns"],
    slots: ["heading", "images[]"],
    since: "v5",
    status: "stable",
    examples: [
      {
        label: "Grid · 3",
        props: {
          columns: 3,
          heading: { title: "Recent work" },
          images: Array.from({ length: 6 }, (_, i) => ({
            src: `${IMG}#g${i}`,
            alt: `Recent work ${i + 1}`,
          })),
        },
      },
    ],
  },
  form: {
    type: "form",
    title: "Form",
    purpose: "Embed any enabled engine form (config/forms.ts) in a page.",
    primitives: ["SectionShell", "DynamicForm"],
    layouts: ["centered"],
    variants: ["heading"],
    slots: ["heading", "form"],
    since: "v1",
    status: "stable",
    examples: [
      {
        label: "Contact",
        props: {
          heading: { title: "Get in touch" },
          form: "contact",
        },
      },
    ],
  },
};

/** Every registered section, as a flat array (catalog order). */
export const sectionMetaList: SectionMeta[] = Object.values(sectionMeta);
