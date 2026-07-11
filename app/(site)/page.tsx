import { Gauge, LayoutTemplate, Lock, Moon, Search, Smartphone } from "lucide-react";

import { Cta, Faq, Features, Hero, Testimonials } from "@/components/sections";

/**
 * Demo homepage. Composed entirely from section components with typed
 * content — this is the pattern every client site follows.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="LaunchPoint Starter Kit"
        title="Websites that feel expensive, shipped fast"
        description="A production-grade foundation: fast, accessible, and ready to ship for every client."
        actions={[
          { label: "Get started", href: "/contact" },
          { label: "Learn more", href: "/about", variant: "outline" },
        ]}
      />
      <Features
        heading={{
          eyebrow: "Why LaunchPoint",
          title: "Everything a premium site needs, built in",
          description: "No plugins to glue together. One coherent, tested foundation.",
        }}
        features={[
          {
            icon: Gauge,
            title: "Performance first",
            description:
              "Static rendering, optimized images and fonts. Lighthouse 95+ as a baseline.",
          },
          {
            icon: Search,
            title: "SEO ready",
            description:
              "Dynamic metadata, Open Graph images, structured data, and sitemaps out of the box.",
          },
          {
            icon: Moon,
            title: "Dark mode",
            description: "System-aware theming with zero flash, driven entirely by design tokens.",
          },
          {
            icon: Smartphone,
            title: "Mobile first",
            description: "Every component designed for small screens first and enhanced upward.",
          },
          {
            icon: Lock,
            title: "Secure by default",
            description:
              "Validated input at every boundary, security headers, and row-level security.",
          },
          {
            icon: LayoutTemplate,
            title: "Composable sections",
            description:
              "Assemble complete pages from typed, reusable sections — no custom CSS needed.",
          },
        ]}
      />
      <Testimonials
        heading={{ eyebrow: "Testimonials", title: "Trusted by ambitious teams" }}
        testimonials={[
          {
            quote:
              "The site paid for itself in the first month. Fast, beautiful, and effortless to update.",
            author: "Alex Rivera",
            role: "Founder, Northwind",
          },
          {
            quote:
              "Our Lighthouse scores went from 60s to high 90s. Search traffic followed within weeks.",
            author: "Priya Shah",
            role: "Marketing Director, Acme Co",
          },
          {
            quote:
              "The admin dashboard is so simple our whole team publishes without touching a developer.",
            author: "Marcus Lee",
            role: "COO, Brightline",
          },
        ]}
      />
      <Faq
        heading={{ eyebrow: "FAQ", title: "Common questions" }}
        items={[
          {
            question: "How fast can a new site launch?",
            answer:
              "Most sites go from kickoff to live in a matter of weeks. The foundation is already production-ready — time goes into your content and brand, not plumbing.",
          },
          {
            question: "Can I edit content myself?",
            answer:
              "Yes. The built-in CMS lets your team create, preview, and publish content from an admin dashboard — no developer required.",
          },
          {
            question: "Is it accessible?",
            answer:
              "Accessibility is built into every component: keyboard navigation, screen reader support, and reduced-motion preferences are respected throughout.",
          },
        ]}
      />
      <Cta
        title="Ready to launch?"
        description="Get a fast, beautiful, maintainable website built on a proven foundation."
        actions={[{ label: "Start your project", href: "/contact" }]}
      />
    </>
  );
}
