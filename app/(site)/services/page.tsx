import type { Metadata } from "next";
import { Gauge, LayoutTemplate, Search, Wrench } from "lucide-react";

import { Cta, Faq, Features, Hero, Pricing } from "@/components/sections";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description: "What we do and what it costs.",
  path: "/services",
});

/** Demo content — replace per client (or convert to a CMS page). */

const en = {
  hero: {
    eyebrow: "Services",
    title: "Everything your business needs online",
    description: "From launch to long-term growth — one team, one point of contact.",
  },
  features: {
    heading: { title: "What we do" },
    items: [
      {
        title: "Website design & build",
        description: "Custom, conversion-focused websites delivered in weeks, not months.",
      },
      {
        title: "Local SEO",
        description: "Structured data, reviews, and content that puts you on the map.",
      },
      {
        title: "Care & maintenance",
        description: "Updates, backups, and content changes handled for you every month.",
      },
      {
        title: "Performance audits",
        description: "Make an existing site fast — Core Web Vitals, accessibility, SEO.",
      },
    ],
  },
  pricing: {
    heading: { eyebrow: "Pricing", title: "Simple, honest pricing" },
    popularLabel: "Most popular",
    tiers: [
      {
        name: "Launch",
        description: "For new businesses",
        price: "$4,900",
        features: ["5-page custom site", "Mobile-first design", "Local SEO setup", "30 days support"],
        cta: "Start a project",
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
        cta: "Start a project",
      },
      {
        name: "Scale",
        description: "Custom engagements",
        price: "Custom",
        features: ["Multi-location", "E-commerce & payments", "Integrations", "Ongoing partnership"],
        cta: "Talk to us",
      },
    ],
  },
  faq: {
    heading: { eyebrow: "FAQ", title: "Questions about working with us" },
    items: [
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
    ],
  },
  cta: { title: "Ready to start?", action: "Get a quote" },
};

const es: typeof en = {
  hero: {
    eyebrow: "Servicios",
    title: "Todo lo que tu negocio necesita en línea",
    description: "Del lanzamiento al crecimiento a largo plazo: un solo equipo, un solo contacto.",
  },
  features: {
    heading: { title: "Lo que hacemos" },
    items: [
      {
        title: "Diseño y desarrollo web",
        description: "Sitios personalizados y enfocados en conversión, entregados en semanas, no meses.",
      },
      {
        title: "SEO local",
        description: "Datos estructurados, reseñas y contenido que te ponen en el mapa.",
      },
      {
        title: "Cuidado y mantenimiento",
        description: "Actualizaciones, copias de seguridad y cambios de contenido gestionados cada mes.",
      },
      {
        title: "Auditorías de rendimiento",
        description: "Haz que un sitio existente sea rápido: Core Web Vitals, accesibilidad y SEO.",
      },
    ],
  },
  pricing: {
    heading: { eyebrow: "Precios", title: "Precios simples y honestos" },
    popularLabel: "Más popular",
    tiers: [
      {
        name: "Lanzamiento",
        description: "Para negocios nuevos",
        price: "$4,900",
        features: [
          "Sitio personalizado de 5 páginas",
          "Diseño móvil primero",
          "Configuración de SEO local",
          "30 días de soporte",
        ],
        cta: "Iniciar un proyecto",
      },
      {
        name: "Crecimiento",
        description: "El más popular",
        price: "$9,800",
        features: [
          "10+ páginas con CMS",
          "Blog y estrategia de contenido",
          "Formularios de reserva o cotización",
          "90 días de soporte",
        ],
        cta: "Iniciar un proyecto",
      },
      {
        name: "Escala",
        description: "Proyectos a medida",
        price: "A medida",
        features: [
          "Múltiples ubicaciones",
          "Comercio electrónico y pagos",
          "Integraciones",
          "Alianza continua",
        ],
        cta: "Hablemos",
      },
    ],
  },
  faq: {
    heading: { eyebrow: "Preguntas frecuentes", title: "Preguntas sobre trabajar con nosotros" },
    items: [
      {
        question: "¿Cuánto tarda un proyecto?",
        answer:
          "La mayoría de los sitios se lanzan en 3 a 6 semanas, según el alcance y la rapidez con que se reúna el contenido.",
      },
      {
        question: "¿Ofrecen planes de pago?",
        answer:
          "Sí, normalmente 50% para comenzar y 50% al lanzar, con opciones mensuales para proyectos más grandes.",
      },
      {
        question: "¿Pueden trabajar con nuestra marca actual?",
        answer:
          "Por supuesto. Construimos sobre tu identidad existente o te ayudamos a renovarla como parte del proyecto.",
      },
    ],
  },
  cta: { title: "¿Listo para empezar?", action: "Solicita una cotización" },
};

const content = { en, es };

export default async function ServicesPage() {
  const t = content[await getLocale()];
  const featureIcons = [LayoutTemplate, Search, Wrench, Gauge];

  return (
    <>
      <Hero eyebrow={t.hero.eyebrow} title={t.hero.title} description={t.hero.description} />
      <Features
        heading={t.features.heading}
        columns={2}
        features={t.features.items.map((f, i) => ({ ...f, icon: featureIcons[i] }))}
      />
      <Pricing
        heading={t.pricing.heading}
        popularLabel={t.pricing.popularLabel}
        tiers={t.pricing.tiers.map((tier, i) => ({
          ...tier,
          cta: { label: tier.cta, href: "/contact" },
          highlighted: i === 1,
        }))}
      />
      <Faq heading={t.faq.heading} items={t.faq.items} />
      <Cta title={t.cta.title} actions={[{ label: t.cta.action, href: "/contact" }]} />
    </>
  );
}
