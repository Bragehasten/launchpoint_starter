import type { Metadata } from "next";
import { Gauge, LayoutTemplate, Search, Wrench } from "lucide-react";

import { Cta, Faq, Features, Hero, Pricing } from "@/components/sections";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description: "What we do and what it costs.",
  path: "/services",
});

/** Demo content — replace per client (or convert to a CMS page). */
export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="Services"
        title="Everything your business needs online"
        description="From launch to long-term growth — one team, one point of contact."
      />
      <Features
        heading={{ title: "What we do" }}
        columns={2}
        features={[
          {
            icon: LayoutTemplate,
            title: "Website design & build",
            description: "Custom, conversion-focused websites delivered in weeks, not months.",
          },
          {
            icon: Search,
            title: "Local SEO",
            description: "Structured data, reviews, and content that puts you on the map.",
          },
          {
            icon: Wrench,
            title: "Care & maintenance",
            description: "Updates, backups, and content changes handled for you every month.",
          },
          {
            icon: Gauge,
            title: "Performance audits",
            description: "Make an existing site fast — Core Web Vitals, accessibility, SEO.",
          },
        ]}
      />
      <Pricing
        heading={{ eyebrow: "Pricing", title: "Simple, honest pricing" }}
        tiers={[
          {
            name: "Launch",
            description: "For new businesses",
            price: "$4,900",
            features: [
              "5-page custom site",
              "Mobile-first design",
              "Local SEO setup",
              "30 days support",
            ],
            cta: { label: "Start a project", href: "/contact" },
          },
          {
            name: "Grow",
            description: "Most popular",
            price: "$9,800",
            features: [
              "10+ pages with CMS",
              "Blog & content strategy",
              "Booking or quote forms",
              "90 days support",
            ],
            cta: { label: "Start a project", href: "/contact" },
            highlighted: true,
          },
          {
            name: "Scale",
            description: "Custom engagements",
            price: "Custom",
            features: [
              "Multi-location",
              "E-commerce & payments",
              "Integrations",
              "Ongoing partnership",
            ],
            cta: { label: "Talk to us", href: "/contact" },
          },
        ]}
      />
      <Faq
        heading={{ eyebrow: "FAQ", title: "Questions about working with us" }}
        items={[
          {
            question: "How long does a project take?",
            answer:
              "Most sites launch within 3–6 weeks depending on scope and how quickly content comes together.",
          },
          {
            question: "Do you offer payment plans?",
            answer:
              "Yes — typically 50% to start and 50% at launch, with monthly options for larger projects.",
          },
          {
            question: "Can you work with our existing brand?",
            answer:
              "Absolutely. We build on your existing identity or help you refresh it as part of the project.",
          },
        ]}
      />
      <Cta title="Ready to start?" actions={[{ label: "Get a quote", href: "/contact" }]} />
    </>
  );
}
